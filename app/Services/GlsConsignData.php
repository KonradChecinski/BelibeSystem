<?php

namespace App\Services;

use Illuminate\Support\Carbon;
use InvalidArgumentException;

/**
 * GlsConsignData - DTO reprezentujący przesyłkę (ConsignExt minimal set + options).
 * Waliduje wymagane pola przy tworzeniu.
 *
 * Pola (nazwy w DTO zgodne z dokumentacją GLS):
 *  - rname1 (required), rname2, rname3
 *  - rcountry (required, ISO2), rzipcode (required), rcity (required), rstreet (required)
 *  - rphone, rcontact
 *  - references, notes
 *  - date (YYYY-MM-DD) optional
 *  - COD => int (amount in cents) optional
 *  - parcels => array (handled separately as GlsParcel objects)
 *  - additional => array (for any extra fields)
 */
class GlsConsignData
{
    public string $name1;
    public ?string $name2 = null;
    public ?string $name3 = null;

    public string $country; // ISO2
    public string $zipcode;
    public string $city;
    public string $street;

    public ?string $phone = null;
    public ?string $email = null;

    public ?string $comment = null;

    public ?Carbon $date = null; // YYYY-MM-DD

    // COD as integer cents (e.g., 12345 means 123.45 PLN)
    public ?int $COD = null;

    /**
     * Konstruktor oczekuje tablicy pól i waliduje minimalne wymagania.
     * Rzuca InvalidArgumentException jeśli coś nie tak.
     * @param array{
     *     name1: string,
     *     country: string,
     *     zipcode: string,
     *     city: string,
     *     street: string,
     *     name2?: string,
     *     name3?: string,
     *     phone?: string,
     *     email?: string,
     *     comment?: string,
     *     date?: Carbon,
     *     COD?: int,
     * } $data
     * @return void
     * @throws InvalidArgumentException
     */
    public function __construct(array $data)
    {
        // required
        $required = ['name1', 'country', 'zipcode', 'city', 'street'];
        foreach ($required as $k) {
            if (empty($data[$k])) {
                throw new InvalidArgumentException("Missing consign required field: {$k}");
            }
            $this->{$k} = $data[$k];
        }

        // opcjonalne czesci nazwy
        $this->name2 = $data['name2'] ?? null;
        $this->name3 = $data['name3'] ?? null;

        $this->phone = $data['phone'] ?? null;
        $this->email = $data['email'] ?? null;

        $this->comment = $data['comment'] ?? null;

        // data
        if (!empty($data['date'])) {
            // simple YYYY-MM-DD check
//            if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $data['date'])) {
//                throw new InvalidArgumentException('date must be in YYYY-MM-DD format');
//            }
            // Sprawdzenie czy data nie jest w przeszłości (użycie Carbon)
            if ($data['date']->startOfDay()->lt(now()->startOfDay())) {
                throw new InvalidArgumentException('date cannot be in the past');
            }

            $this->date = $data['date'];
        } else {
            $this->date = Carbon::now()->startOfDay(); // default to today
        }

        // COD: if provided, must be integer (cents)
        if (isset($data['COD'])) {
            if (!is_int($data['COD'])) {
                throw new InvalidArgumentException('COD must be integer amount in cents (e.g., 12345 for 123.45)');
            }
            $this->COD = $data['COD'];
        }

        // enforce max lengths as per spec (truncate or error) - throw if too long
        $this->assertMaxLen('name1', 40);
        if ($this->name2) $this->assertMaxLen('name2', 40);
        if ($this->name3) $this->assertMaxLen('name3', 40);
        $this->assertMaxLen('street', 46);
        $this->assertMaxLen('city', 30);
        $this->assertMaxLen('zipcode', 16);
        if ($this->phone) $this->assertMaxLen('phone', 20);
        if ($this->email) $this->assertMaxLen('email', 80);
        if ($this->comment) $this->assertMaxLen('comment', 80);
    }

    protected function assertMaxLen(string $field, int $max): void
    {
        if (!isset($this->{$field})) return;
        $v = $this->{$field};
        if ($v !== null && mb_strlen($v) > $max) {
            throw new InvalidArgumentException("Field {$field} exceeds max length of {$max}");
        }
    }

    /**
     * Zwraca tablicę pól w formacie używanym przez serwis (ConsignExt keys).
     */
    public function toGLSArray(): array
    {
        $arr = [
            'rname1' => $this->name1,
        ];
        if ($this->name2) $arr['rname2'] = $this->name2;
        if ($this->name3) $arr['rname3'] = $this->name3;

        $arr['rcountry'] = $this->country;
        $arr['rzipcode'] = $this->zipcode;
        $arr['rcity'] = $this->city;
        $arr['rstreet'] = $this->street;

        if ($this->phone) $arr['rphone'] = $this->phone;
        if ($this->email) $arr['rcontact'] = $this->email;

        if ($this->comment) $arr['notes'] = $this->comment;

        if ($this->date) $arr['date'] = $this->date->format('Y-m-d');

        if ($this->COD !== null) {
            $arr['srv_bool'] = [
                'cod' => true,
                'cod_amount' => $this->getCodAmountFloat(),
//                'exw' => false,
//                'rod' => false,
//                'pod' => false,
//                'exc' => false,
//                'ident' => false,
//                'daw' => false,
//                'ps' => false,
//                'pr' => false,
//                's10' => false,
//                's12' => false,
//                'sat' => false,
//                'ow' => false,
//                'srs' => false,
//                'sds' => false,
//                'cdx' => false,
//                'cdx_amount' => 0.0,
//                'cdx_currency' => '',
//                'ado' => false
            ];
        }

        return $arr;
    }

    public function toArray(): array
    {
        return $this->toGLSArray();
    }

    /**
     * Zwraca kwotę COD jako float (np. 12345 -> 123.45)
     */
    public function getCodAmountFloat(): ?float
    {
        if ($this->COD === null) return null;
        return $this->COD / 100.0;
    }
}
