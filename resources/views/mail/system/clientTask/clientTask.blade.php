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
<h4>Przypomnienie o zadaniu</h4>
<p>Zadanie dot. klienta: <b>{{ $client->name}}</b></p>
<x-mail::panel :error="true">
    <h1>{{$clientTask->title}}</h1>
    <p>{{$clientTask->text}}</p>
    <div style="margin-top: 25px">{{$clientTask->user->name}}<div class="vertical-hr"></div>{{\Illuminate\Support\Carbon::parse($clientTask->created_at)->format("d-m-Y H:i")}}</div>
    <div style="padding: 5px;position: absolute; top: 0; right: 0; border-radius: 50px; border: 1px solid {{$late? "#f44336b3": "black"}}; color: {{$late? "#f44336": ""}}">{{\Illuminate\Support\Carbon::parse($clientTask->datetime)->format("d-m-Y H:i")}}</div>
</x-mail::panel>
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
