{{--@formatter:off--}}
@props([
    'error' => false,
])
<table class="panel {{$error? "panel-error": ""}}" width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td class="panel-content {{$error? "panel-content-error": ""}}">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td class="panel-item">
{{ Illuminate\Mail\Markdown::parse($slot) }}
</td>
</tr>
</table>
</td>
</tr>
</table>

