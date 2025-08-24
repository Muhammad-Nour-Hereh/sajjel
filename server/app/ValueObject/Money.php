<?php

namespace App\ValueObjects;

use App\ValueObjects\Currency;
class Money
{
    public float $amount;
    public Currency $currency;

    public const int USD_LBP_RATE = 89500;

    public function __construct(float $amount, Currency $currency)
    {
        $this->amount = $amount;
        $this->currency = $currency;
    }

    /** Convert this money to USD */
    public function toUSD(): self
    {
        if ($this->currency === 'USD')
            return $this;
        return new self($this->amount / self::USD_LBP_RATE, Currency::USD);
    }

    /** Convert this money to LBP */
    public function toLBP(): self
    {
        if ($this->currency === 'LBP')
            return $this;
        return new self($this->amount * self::USD_LBP_RATE, Currency::LBP);
    }

    /** Add two Money objects, converting currencies if necessary */
    public function add(Money $other): self
    {
        $base = $this->toUSD();           // use USD as standard
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

    /** Format nicely */
    public function __toString(): string
    {
        return number_format($this->amount, 2) . ' ' . $this->currency;
    }
}
