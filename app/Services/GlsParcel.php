<?php

namespace App\Services;

use Illuminate\Support\Str;
use InvalidArgumentException;

/**
 * GlsParcel - DTO opisujący pojedynczą paczkę w przesyłce
 * Pola:
 *  - reference (string, opcjonalne, max 25)
 *  - weight (float, wymagane, >= 0.01)
 */
class GlsParcel
{
    public ?string $reference = null;
    public float $weight;


    /**
     * @param array{
     *     reference?: string,
     *     weight: float,
     * } $data
     * @return void
     * @throws InvalidArgumentException
     */
    public function __construct(array $data)
    {
        if (!isset($data['weight']) || !is_numeric($data['weight'])) {
            throw new InvalidArgumentException('Parcel weight is required and must be numeric.');
        }
        $this->weight = (float)$data['weight'];
        if ($this->weight < 0.01) {
            throw new InvalidArgumentException('Parcel weight must be at least 0.01 kg.');
        }

        if (!empty($data['reference'])) {
            if (mb_strlen($data['reference']) > 25) {
                throw new InvalidArgumentException('Parcel reference exceeds max length 25');
            }
            $this->reference = $data['reference'];
        }
    }

    public function toArray(): array
    {
        $arr = ['weight' => $this->weight];
        if (!empty($this->reference)) $arr['reference'] = Str::limit($this->reference, 25);
        return $arr;
    }
}
