---
description: Access ETH Gas.watch data
---

# API

{% api-method method="get" host="http://ethgas.watch/api" path="/gas" %}
{% api-method-summary %}
Gas
{% endapi-method-summary %}

{% api-method-description %}
This endpoint allows you to get the latest gas price data, similar to what is shown on the website.
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

```
{
    "slow": {
        "gwei": 199,
        "usd": 12.84
    },
    "normal": {
        "gwei": 208,
        "usd": 13.42
    },
    "fast": {
        "gwei": 221,
        "usd": 14.26
    },
    "instant": {
        "gwei": 243,
        "usd": 15.68
    },
    "ethPrice": 3072.61,
    "lastUpdated": 1641851674313,
    "sources": [
        {
            "name": "Etherscan",
            "source": "https://etherscan.io/gastracker",
            "fast": 219,
            "standard": 217,
            "slow": 217,
            "lastBlock": 13980268
        },
        {
            "name": "Gas station",
            "source": "https://ethgasstation.info/",
            "instant": 312,
            "fast": 265,
            "standard": 215,
            "slow": 201,
            "lastBlock": 13980267
        },
        {
            "name": "MyCrypto",
            "source": "https://gas.mycryptoapi.com/",
            "instant": 243,
            "fast": 223,
            "standard": 201,
            "slow": 181,
            "lastBlock": 13980267
        },
        {
            "name": "Upvest",
            "source": "https://doc.upvest.co/reference#ethereum-fees",
            "instant": 226,
            "fast": 218,
            "standard": 201,
            "slow": 196,
            "lastUpdate": 1641851673884
        }
    ]
}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

{% api-method method="get" host="http://ethgas.watch/api" path="/gas/trend" %}
{% api-method-summary %}
Trend
{% endapi-method-summary %}

{% api-method-description %}
This endpoint allows you to get historical gas price data. Chose one of the query params below to retrieve either the daily or the hourly trend data.
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-query-parameters %}
{% api-method-parameter name="hours" type="number" required=false %}
Amount of hours to return \(e.g. 24 for 1 day\)
{% endapi-method-parameter %}

{% api-method-parameter name="days" type="number" required=false %}
Amount of days to return \(e.g. 7 for 1 week\)
{% endapi-method-parameter %}
{% endapi-method-query-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

```
{
	"labels": ["Sep 17, 2020", "Sep 18, 2020", "Sep 19, 2020", "Sep 20, 2020", "Sep 21, 2020", "Sep 22, 2020", "Sep 23, 2020", "Sep 24, 2020"],
	"slow": [431, 231.5, 165.5, 71, 64, 64, 63.5, 61],
	"normal": [491, 250, 151, 80, 290, 257.5, 66, 71],
	"fast": [500, 285, 149.5, 174, 242, 178.5, 178.5, 75],
	"instant": [559, 341.5, 159, 124, 163, 178, 150, 85]
}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

{% api-method method="get" host="http://ethgas.watch/api" path="/alerts/stats" %}
{% api-method-summary %}
Stats
{% endapi-method-summary %}

{% api-method-description %}
This endpoint allows you to get statistics on the amount of alerts and registrations.
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-query-parameters %}
{% api-method-parameter name="days" type="number" required=true %}
Amount of days to return \(e.g. 7 for 1 week\)
{% endapi-method-parameter %}
{% endapi-method-query-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

```
{
	"alerts": 750,
	"unique": 548,
	"average": 125,
	"mode": 100
}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

