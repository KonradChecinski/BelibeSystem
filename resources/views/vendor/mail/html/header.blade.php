@props(['url'])
<tr>
    <td class="header">
        <a href="{{ $url }}" style="display: inline-block;">
            @if (trim($slot) === 'Belibe')
                <img src="https://system.belibe.pl/storage/logo>logo.png" class="logo" alt="Belibe Logo">
            @else
                {{ $slot }}
            @endif
        </a>
    </td>
</tr>
