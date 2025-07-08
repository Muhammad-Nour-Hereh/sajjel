export const USD_LB_RATE = 89_500

export type currency = 'USD' | 'LBP'

export class Price {
  constructor(
    public amount: number,
    public currency: currency,
  ) {}

  format(locale = 'en-US') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: this.currency,
    }).format(this.amount)
  }

  // Example: rough conversion between LBP and USD
  convertTo(targetCurrency: currency, rate: number = USD_LB_RATE): Price {
    const newAmount =
      this.currency === targetCurrency
        ? this.amount
        : this.currency === 'USD'
          ? this.amount * rate
          : this.amount / rate

    return new Price(newAmount, targetCurrency)
  }
}

