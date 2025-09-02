<?php
namespace App\ValueObjects;
use App\ValueObjects\Currency;

class Money
{
    public float $amount;
    public Currency $currency;

    public const USD_LBP_RATE = 89500;

    public function __construct(float $amount, Currency $currency)
    {
        $this->amount = round($amount, 2);
        $this->currency = $currency;
    }

    public static function of(float $amount, Currency $currency): self
    {
        return new self($amount, $currency);
    }

    public static function usd(float $amount): self
    {
        return new self($amount, Currency::USD);
    }

    public static function lbp(float $amount): self
    {
        return new self($amount, Currency::LBP);
    }

    public static function zero(): self
    {
        return new self(0, Currency::USD);
    }

    /** Convert this money to USD */
    public function toUSD(): self
    {
        if ($this->currency === Currency::USD)
            return $this;

        return new self($this->amount / self::USD_LBP_RATE, Currency::USD);
    }

    /** Convert this money to LBP */
    public function toLBP(): self
    {
        if ($this->currency === Currency::LBP)
            return $this;

        return new self($this->amount * self::USD_LBP_RATE, Currency::LBP);
    }

    /** Add two Money objects, converting currencies if necessary */
    public function add(Money $other): self
    {
        $base = $this->toUSD();
        $otherUSD = $other->toUSD();

        return new self($base->amount + $otherUSD->amount, Currency::USD);
    }

    /** Subtract two Money objects */
    public function subtract(Money $other): self
    {
        $base = $this->toUSD();
        $otherUSD = $other->toUSD();

        return new self($base->amount - $otherUSD->amount, Currency::USD);
    }

    public function multiply(int|float $multiplier): self
    {
        return new self(
            $this->amount * $multiplier,
            $this->currency
        );
    }

    /** Format nicely */
    public function __toString(): string
    {
        return number_format($this->amount, 2) . ' ' . $this->currency->value;
    }
}