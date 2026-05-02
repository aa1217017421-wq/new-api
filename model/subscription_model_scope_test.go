package model

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/require"
)

func seedSubscriptionPlanScope(t *testing.T, id int, upgradeGroup string, totalAmount int64) {
	t.Helper()
	plan := &SubscriptionPlan{
		Id:            id,
		Title:         "test plan",
		DurationUnit:  SubscriptionDurationDay,
		DurationValue: 7,
		Enabled:       true,
		UpgradeGroup:  upgradeGroup,
		TotalAmount:   totalAmount,
	}
	require.NoError(t, DB.Create(plan).Error)
	InvalidateSubscriptionPlanCache(id)
}

func seedActiveSubscriptionScope(t *testing.T, id int, userId int, planId int, upgradeGroup string, totalAmount int64, amountUsed int64) {
	t.Helper()
	now := GetDBTimestamp()
	sub := &UserSubscription{
		Id:           id,
		UserId:       userId,
		PlanId:       planId,
		AmountTotal:  totalAmount,
		AmountUsed:   amountUsed,
		StartTime:    now - 60,
		EndTime:      now + 3600,
		Status:       "active",
		UpgradeGroup: upgradeGroup,
	}
	require.NoError(t, DB.Create(sub).Error)
}

func seedAbilityScope(t *testing.T, group string, modelName string) {
	t.Helper()
	ability := &Ability{
		Group:     group,
		Model:     modelName,
		ChannelId: 1,
		Enabled:   true,
	}
	require.NoError(t, DB.Create(ability).Error)
}

func TestPreConsumeUserSubscriptionUsesCoveredGroupModel(t *testing.T) {
	truncateTables(t)

	seedSubscriptionPlanScope(t, 101, "openai-不限量套餐", 0)
	seedActiveSubscriptionScope(t, 101, 1, 101, "openai-不限量套餐", 0, 0)
	seedAbilityScope(t, "openai-不限量套餐", "gpt-5.5")

	res, err := PreConsumeUserSubscription("req-covered-model", 1, "gpt-5.5", 0, 100)

	require.NoError(t, err)
	require.Equal(t, 101, res.UserSubscriptionId)
	require.EqualValues(t, 100, res.PreConsumed)

	var sub UserSubscription
	require.NoError(t, DB.First(&sub, 101).Error)
	require.EqualValues(t, 100, sub.AmountUsed)
}

func TestPreConsumeUserSubscriptionSkipsUncoveredGroupModel(t *testing.T) {
	truncateTables(t)

	seedSubscriptionPlanScope(t, 102, "openai-不限量套餐", 0)
	seedActiveSubscriptionScope(t, 102, 1, 102, "openai-不限量套餐", 0, 0)
	seedAbilityScope(t, "openai-不限量套餐", "gpt-5.5")

	_, err := PreConsumeUserSubscription("req-uncovered-model", 1, "claude-sonnet-4-5", 0, 100)

	require.ErrorIs(t, err, ErrSubscriptionModelNotCovered)

	var sub UserSubscription
	require.NoError(t, DB.First(&sub, 102).Error)
	require.EqualValues(t, 0, sub.AmountUsed)

	var recordCount int64
	require.NoError(t, DB.Model(&SubscriptionPreConsumeRecord{}).
		Where("request_id = ?", "req-uncovered-model").
		Count(&recordCount).Error)
	require.EqualValues(t, 0, recordCount)
}

func TestPreConsumeUserSubscriptionFallsThroughToCoveredSubscription(t *testing.T) {
	truncateTables(t)

	seedSubscriptionPlanScope(t, 103, "openai-不限量套餐", 0)
	seedSubscriptionPlanScope(t, 104, "claude", 0)
	seedActiveSubscriptionScope(t, 103, 1, 103, "openai-不限量套餐", 0, 0)
	seedActiveSubscriptionScope(t, 104, 1, 104, "claude", 0, 0)
	seedAbilityScope(t, "openai-不限量套餐", "gpt-5.5")
	seedAbilityScope(t, "claude", "claude-sonnet-4-5")

	res, err := PreConsumeUserSubscription("req-covered-second-subscription", 1, "claude-sonnet-4-5", 0, 100)

	require.NoError(t, err)
	require.Equal(t, 104, res.UserSubscriptionId)
}

func TestPreConsumeUserSubscriptionKeepsLegacyBlankUpgradeGroupUnscoped(t *testing.T) {
	truncateTables(t)

	seedSubscriptionPlanScope(t, 105, "", 0)
	seedActiveSubscriptionScope(t, 105, 1, 105, "", 0, 0)

	_, err := PreConsumeUserSubscription("req-legacy-unscoped", 1, "any-model", 0, 100)

	require.NoError(t, err)
}

func TestPreConsumeUserSubscriptionReturnsQuotaInsufficientForCoveredExhaustedPlan(t *testing.T) {
	truncateTables(t)

	seedSubscriptionPlanScope(t, 106, "openai-不限量套餐", 100)
	seedActiveSubscriptionScope(t, 106, 1, 106, "openai-不限量套餐", 100, 50)
	seedAbilityScope(t, "openai-不限量套餐", "gpt-5.5")

	_, err := PreConsumeUserSubscription("req-covered-quota-insufficient", 1, "gpt-5.5", 0, 100)

	require.True(t, errors.Is(err, ErrSubscriptionQuotaInsufficient), "err=%v", err)
}
