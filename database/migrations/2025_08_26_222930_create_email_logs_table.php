<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('email_logs', function (Blueprint $table) {
            $table->id();

            // Powiązanie do modelu, który wygenerował maila (opcjonalne)
            $table->morphs('mailable'); // mailable_type + mailable_id

            // Jeśli mail pochodzi z Notification — kto był notifiable (np. User)
            $table->nullableMorphs('notifiable'); // notifiable_type + notifiable_id (nullable)

            // Dodatkowe info o pochodzeniu (mailable / notification / raw)
            $table->string('origin_type')->nullable();   // 'mailable' | 'notification' | 'raw'
            $table->string('origin_class')->nullable();  // np. App\Mail\OrderShipped lub App\Notifications\ResetPassword

            // Adresy jako JSON (lista {name,address})
            $table->json('from')->nullable();
            $table->json('to')->nullable();
            $table->json('cc')->nullable();
            $table->json('bcc')->nullable();

            // Pomoc do szybkiego wyszukiwania po odbiorcach
            $table->text('to_emails')->nullable(); // "a@b.com,b@c.com"

            $table->string('subject')->nullable();
            $table->longText('body')->nullable();

            $table->json('headers')->nullable();
            $table->json('attachments')->nullable(); // lista nazw plików

            $table->unsignedBigInteger('size')->nullable();
            $table->string('message_id')->nullable()->index();

            $table->timestamp('sent_at')->nullable();

            $table->timestamps();

            $table->index(['mailable_type', 'mailable_id']);
            $table->index('sent_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email_logs');
    }
};
