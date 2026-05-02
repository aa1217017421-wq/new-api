package service

import (
	"net/http/httptest"
	"testing"

	"github.com/QuantumNous/new-api/model"
	relaycommon "github.com/QuantumNous/new-api/relay/common"
	"github.com/QuantumNous/new-api/types"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
)

type failingFundingSource struct {
	source string
	err    error
}

func (f failingFundingSource) Source() string {
	return f.source
}

func (f failingFundingSource) PreConsume(_ int) error {
	return f.err
}

func (f failingFundingSource) Settle(_ int) error {
	return nil
}

func (f failingFundingSource) Refund() error {
	return nil
}

func TestBillingSessionPreConsumeMapsSubscriptionModelNotCoveredToInsufficientQuota(t *testing.T) {
	gin.SetMode(gin.TestMode)
	c, _ := gin.CreateTestContext(httptest.NewRecorder())

	session := &BillingSession{
		relayInfo: &relaycommon.RelayInfo{UserId: 1},
		funding: failingFundingSource{
			source: BillingSourceSubscription,
			err:    model.ErrSubscriptionModelNotCovered,
		},
	}

	apiErr := session.preConsume(c, 0)

	require.NotNil(t, apiErr)
	require.Equal(t, types.ErrorCodeInsufficientUserQuota, apiErr.GetErrorCode())
	require.Contains(t, apiErr.Error(), "当前模型不在订阅套餐范围内")
}
