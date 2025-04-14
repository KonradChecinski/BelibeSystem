<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Label - {{$productModel->symbol}}</title>


    <style>
        @page {
            margin: 15px;
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
            font-size: 30px;
        }

        .text-vertical {
            /*writing-mode: vertical-rl;*/
            transform: rotate(90deg);
            /*text-orientation: upright;*/
        }

        .flex {
            display: flex;
        }

        .flex-justify-center {
            justify-content: center;
        }

        .flex-align-center {
            align-items: center;
        }
    </style>

</head>
<body>
<div class="w-full">
    <p class="w-full center font-bold font-big">{{$productModel->symbol}}</p>

</div>
<div class="w-full">
    <p class="w-full center font-bold">Rozmiary</p>
    <div class=" center flex flex-justify-center flex-align-center">
        @foreach($sizes as $size)
            <p class="w-half center font-bold">{{$size->name}}</p>
        @endforeach
    </div>
</body>
</html>
