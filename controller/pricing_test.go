package controller

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestFilterUsableGroupsByGroupRatio(t *testing.T) {
	usableGroup := map[string]string{
		"claude":       "Claude",
		"default":      "default group",
		"gemini":       "Gemini",
		"openai-不限量套餐": "OpenAI",
		"vip":          "VIP",
	}
	groupRatio := map[string]float64{
		"claude":       1,
		"gemini":       1,
		"openai-不限量套餐": 1,
	}

	filtered := filterUsableGroupsByGroupRatio(usableGroup, groupRatio)

	require.Equal(t, map[string]string{
		"claude":       "Claude",
		"gemini":       "Gemini",
		"openai-不限量套餐": "OpenAI",
	}, filtered)
}
