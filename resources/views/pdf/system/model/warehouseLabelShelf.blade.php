<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Label - Kosz</title>


    <style>
        @page {
            margin: 0px;
            /*margin-bottom: 0px;*/
            /*margin-left: 5.669px;*/
            size: 3cm 8.5cm landscape;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
        }

        .w-full {
            width: 100%;
        }

        .w-half {
            width: 50%;
        }

        .w-30px {
            width: 30px;
        }

        .max-w-half {
            max-width: 50%;
        }

        .w-45 {
            width: 45%;
        }

        .max-w-45 {
            max-width: 45%;
        }

        .center {
            text-align: center;
        }

        .font-bold {
            font-weight: bold;
        }

        .font-big {
            font-size: 10px;
        }

        .text-vertical {
            /*writing-mode: vertical-rl;*/
            transform: rotate(90deg);
            /*text-orientation: upright;*/
        }

        .margin-0 {
            margin: 0;
        }

        .center-div {
            margin-left: auto;
            margin-right: auto;
        }

        .page_break {
            page-break-before: always;
        }

        .naklejka-wrapper {
            width: calc(50% - 5.669px - 24px);
            height: calc(100% - 12px);
            margin-left: 5.669px;
            /*background-color: yellow;*/
            float: left;
            padding: 12px;
            padding-bottom: 0px;
        }

    </style>

</head>
<body>

{{--<div class="w-full">--}}
@for( $i=0; $i < 6; $i++)

    @php
        $qr = null;
        if (extension_loaded('imagick')) {
           $qr = QrCode::size(1000)
                        ->format('png')
                        ->generate("W-KO-".str_pad($start, 4, "0", STR_PAD_LEFT));
        }
    @endphp
    @for( $j=0; $j < 2; $j++)

        <div class="naklejka-wrapper">
            @if ($qr)
                <div class="center-div center">
                    <img src="data:image/png;base64,{!! base64_encode($qr) !!}" style="width: 66px"/>
                </div>
            @endif
            <div class="center font-big font-bold" style="margin-top: 9px">
                {{ "W-KO-".str_pad($start, 4, "0", STR_PAD_LEFT) }}
            </div>
        </div>

    @endfor
    @php $start++; @endphp
    @if( $i != 6 )
        <div class="page_break"></div>
    @endif
@endfor

{{--</div>--}}
</body>
</html>
