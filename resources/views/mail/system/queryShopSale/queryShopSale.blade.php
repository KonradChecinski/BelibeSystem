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
<h1>Wygenerowano zamówienie</h1>
<p>za sprzedaż {{$fromDate->format("d.m.y") . " - " . $toDate->format("d.m.y")}}.</p>
<hr/>
<p>Sprawdź i przetwórz zamówienie.</p>

{{-- Salutation --}}
@if (! empty($salutation))
{{ $salutation }}
@else
@lang('Regards'),<br>
{{ config('app.name') }}
@endif

<hr/>

<h1>Produkty</h1>

@php $i=1 @endphp
<div class="table-row-border">
<x-mail::table>
    | Lp.           | Symbol           | Nazwa      | Ilość     |
    | :-----------: |:-------------:   | :--------: |:--------: |
@foreach($items as $item)
    | {{$i++}}  | {{$item->tw_Symbol}}   | {{$item->tw_Nazwa}}  | {{(int)$item->tw_Ilosc}}  |
@endforeach
</x-mail::table>
</div>



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
