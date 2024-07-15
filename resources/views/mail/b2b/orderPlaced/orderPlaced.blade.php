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
<h1>Dziękujemy za zamówienie</h1>
<p>Numer zamówienia: <b>{{ $clientOrder->number}}</b></p>
<hr/>
<p>Otrzymaliśmy Twoje zamówienie.</p>
<p>Gdy Twoje zamówienie zostanie potwierdzone przez Twojego opiekuna, zabierzemy się do pracy, a Ty dostaniesz od nas e-mail potwierdzający. </p>

{{-- Salutation --}}
@if (! empty($salutation))
{{ $salutation }}
@else
@lang('Regards'),<br>
{{ config('app.name') }}
@endif

<hr/>
<h1>Twoje zamówienie</h1>
<p>Metoda płatności: <b>{{ $clientOrder->payment->name }}</b> {{$clientOrder->discount? "(".$clientOrder->discount."%)": "" }}</p>
<p>Metoda dostawy: <b>{{ $clientOrder->delivery->name }}</b> - {{ $clientOrder->delivery->description }}</p>
<p>Adres dostawy:</p>
<p><b>{{ $location->note }}</b></p>
<p>{{$location->street}} {{ $location->building_number }}{{ $location->apartment_number ? "/" . $location->apartment_number : ""}}</p>
<p>{{ $location->postal_code }}, {{ $location->city }}</p>
<h1>Produkty</h1>
{{--<div class="table">--}}
{{--<table>--}}
{{--    <thead>--}}
{{--    <tr>--}}
{{--        <th>Lp.</th>--}}
{{--        <th>Rozmiar</th>--}}
{{--        <th>Cena Netto</th>--}}
{{--        <th>Cena Brutto</th>--}}
{{--        <th>Ilość</th>--}}
{{--    </tr>--}}
{{--</table>--}}
{{--</div>--}}
@php $i=1 @endphp
<div class="table-row-border">
<x-mail::table>
    | Lp.           | Rozmiar           | Cena Netto    | Cena Brutto   | Ilość     |
    | :-------------: |:-------------:    | :--------:     |:----------:    |:--------:  |
    @foreach($productModels as $productModel)
        |<p>Model</p><td colspan="4"><h2>{{$productModel->symbol}}</h2></td>
        @foreach($productColors->where("product_model_id", $productModel->id) as $productColor)
            |<div><img src="{{route("images.webp", ["path"=> $productColor->images[0]->path])}}" width="50"/></div> <td colspan="4"><p>Kolor {{$productColor->shortcut}}</p>{{$productColor->name}}</td>
            @foreach($products->where("product_model_color_id", $productColor->id) as $product)
                @php $item = $orderProducts->where("product_id", $product->id)->first() @endphp
                | {{$i++}}     | {{$product->size->name}}          | {{$item->price_net/100}}           | {{round($item->price_net * (1 + $item->vat_rate / 100) /100,2)}}           | {{$item->quantity}}       |
            @endforeach
        @endforeach
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
