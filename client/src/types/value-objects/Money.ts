import { Currency, USD_LB_RATE } from './Currency'

export interface Money {
  amount: number
  currency: Currency
}

/**
 * Formats a Price object into a localized currency string.
 *
 * @param price - The Price object to format.
 * @param locale - Optional locale string for formatting (default: 'en-US').
 * @returns A string formatted as currency (e.g., "$1,234.56" for USD)
 */
export const formatPrice = (price: Money, locale = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: price.currency,
  }).format(price.amount)
}

/**
 * Converts a Price object to a target currency using a fixed exchange rate.
 *
 * @param price - The Price object to convert.
 * @param targetCurrency - The currency to convert to ('USD' or 'LBP').
 * @param rate - Exchange rate from USD to LBP (default: USD_LB_RATE)
 * @returns A new Price object in the target currency.
 */
export const convertPriceTo = (
  price: Money,
  targetCurrency: Currency,
  rate: number = USD_LB_RATE,
): Money => {
  const newAmount =
    price.currency === targetCurrency
      ? price.amount
      : price.currency === 'USD'
        ? price.amount * rate
        : price.amount / rate

  return { amount: newAmount, currency: targetCurrency }
}

export namespace Money {
  export const Zero: Money = { amount: 0, currency: 'USD' }
}
