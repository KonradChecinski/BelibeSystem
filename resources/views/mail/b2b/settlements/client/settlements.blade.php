{{--@formatter:off--}}
<x-mail::message>
{{-- Greeting --}}
@if (! empty($greeting))
# {{ $greeting }}
@else
@if ($level === 'error')
# @lang('Whoops!')
@else
# @lang('Hello!')
@endif
@endif

{{-- Intro Lines --}}
<h1>Zestawienie Twoich rozrachunków</h1>
<p><b>{{ $client->name }}</b></p>
<hr/>

<p>
    Przesyłamy aktualne zestawienie Twoich <b>nieuregulowanych rozrachunków</b> w naszym systemie.
</p>
<p>
    Będziemy wdzięczni za uregulowanie zaległości w najbliższym dogodnym terminie.
    Jeśli opłaciłeś już którąś z poniższych faktur i płatność mogła się jeszcze nie zaksięgować,
    po prostu zignoruj tę pozycję lub prześlij potwierdzenie przelewu do swojego opiekuna.
</p>
@php
    $sumOriginal = 0;
    $sumCurrent = 0;
@endphp
<x-mail::table>
    | Nr&nbsp;faktury&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Data wystawienia | Dni opóźnienia | Wartość | Pozostało |
    | :--------- | :--------------: | :------------: | -----------------:| ----------------:|
    @foreach($settlements as $settlement)
        @php
            $sumOriginal += $settlement->original_value;
            $sumCurrent += $settlement->value;

            $color = '';
            $colorRed = '#d00e0e';
            $colorOrange = '#faa91c';
            if ($settlement->days_of_delay > 60) {
                $color = $colorRed;
            } elseif ($settlement->days_of_delay > 10) {
                $color = $colorOrange;
            }
        @endphp
        | {{ $settlement->number }} | {{ $settlement->datetime->toDateString() }} | <span style="color: {{$color}}">{{ $settlement->days_of_delay }}</span> | {!! number_format($settlement->original_value / 100, 2, ',', '&nbsp;') !!} zł | {!! number_format($settlement->value / 100, 2, ',', '&nbsp;') !!} zł |
    @endforeach
    | **Razem** |   |   | &nbsp;&nbsp;&nbsp;**{!! number_format($sumOriginal / 100, 2, ',', '&nbsp;') !!}&nbsp;zł** | <span style="color: {{ $colorRed }}">&nbsp;&nbsp;&nbsp;**{!! number_format($sumCurrent / 100, 2, ',', '&nbsp;') !!}&nbsp;zł**</span> |
</x-mail::table>

<p>
    Podsumowując, aktualna łączna kwota do zapłaty wynosi
    <b style="color: {{ $colorRed }}">{!! number_format($sumCurrent / 100, 2, ',', '&nbsp;') !!}&nbsp;zł</b>.
</p>

<p>
    W razie pytań lub wątpliwości dotyczących tego zestawienia,
    skontaktuj się ze swoim opiekunem.
</p>

<p>
    Dziękujemy za współpracę!
</p>








{{-- Action Button --}}
@isset($actionText)
<?php
    $color = match ($level) {
        'success', 'error' => $level,
        default => 'primary',
    };
?>
<x-mail::button :url="$actionUrl" :color="$color">
{{ $actionText }}
</x-mail::button>
@endisset

{{-- Outro Lines --}}



{{-- Salutation --}}
@if (! empty($salutation))
{{ $salutation }}
@else
@lang('Regards'),<br>
{{ config('app.name') }}
@endif


{{-- Subcopy --}}
@isset($actionText)
<x-slot:subcopy>
@lang(
    "If you're having trouble clicking the \":actionText\" button, copy and paste the URL below\n".
    'into your web browser:',
    [
        'actionText' => $actionText,
    ]
) <span class="break-all">[{{ $displayableActionUrl }}]({{ $actionUrl }})</span>
</x-slot:subcopy>
@endisset
</x-mail::message>
