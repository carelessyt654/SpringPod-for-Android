###### Class com.careless.springpod.MainActivity (com.careless.springpod.MainActivity)
.class public Lcom/careless/springpod/MainActivity;
.super Landroid/app/Activity;
.source "MainActivity.java"


# annotations
.annotation system Ldalvik/annotation/MemberClasses;
    value = {
        Lcom/careless/springpod/MainActivity$Bridge;
    }
.end annotation


# static fields
.field private static final HOST:Ljava/lang/String; = "appassets.local"

.field private static final MAX_READ:J = 0x3000000L

.field private static final REQ_IMPORT:I = 0x1069

.field private static final TAG:Ljava/lang/String; = "SpringPod"


# instance fields
.field private volatile durCache:D

.field private impId:I

.field private impTo:Ljava/lang/String;

.field private mp:Landroid/media/MediaPlayer;

.field private pendingSeek:D

.field private prepared:Z

.field private root:Ljava/io/File;

.field private final ui:Landroid/os/Handler;

.field private vol:F

.field private web:Landroid/webkit/WebView;


# direct methods
.method public constructor <init>()V
    .registers 4

    .prologue
    const/4 v2, 0x0

    .line 42
    invoke-direct {p0}, Landroid/app/Activity;-><init>()V

    .line 50
    new-instance v0, Landroid/os/Handler;

    invoke-static {}, Landroid/os/Looper;->getMainLooper()Landroid/os/Looper;

    move-result-object v1

    invoke-direct {v0, v1}, Landroid/os/Handler;-><init>(Landroid/os/Looper;)V

    iput-object v0, p0, Lcom/careless/springpod/MainActivity;->ui:Landroid/os/Handler;

    .line 54
    iput-boolean v2, p0, Lcom/careless/springpod/MainActivity;->prepared:Z

    .line 55
    const-wide/high16 v0, -0x4010000000000000L    # -1.0

    iput-wide v0, p0, Lcom/careless/springpod/MainActivity;->pendingSeek:D

    .line 56
    const v0, 0x3f333333    # 0.7f

    iput v0, p0, Lcom/careless/springpod/MainActivity;->vol:F

    .line 57
    const-wide/16 v0, 0x0

    iput-wide v0, p0, Lcom/careless/springpod/MainActivity;->durCache:D

    .line 60
    iput v2, p0, Lcom/careless/springpod/MainActivity;->impId:I

    .line 61
    const-string v0, ""

    iput-object v0, p0, Lcom/careless/springpod/MainActivity;->impTo:Ljava/lang/String;

    return-void
.end method

.method static synthetic access$100(Lcom/careless/springpod/MainActivity;Landroid/net/Uri;)Landroid/webkit/WebResourceResponse;
    .registers 3

    .prologue
    .line 42
    invoke-direct {p0, p1}, Lcom/careless/springpod/MainActivity;->serve(Landroid/net/Uri;)Landroid/webkit/WebResourceResponse;

    move-result-object v0

    return-object v0
.end method

.method static synthetic access$1000(Lcom/careless/springpod/MainActivity;)V
    .registers 1

    .prologue
    .line 42
    invoke-direct {p0}, Lcom/careless/springpod/MainActivity;->releasePlayer()V

    return-void
.end method

.method static synthetic access$1100(Lcom/careless/springpod/MainActivity;)Landroid/media/MediaPlayer;
    .registers 2

    .prologue
    .line 42
    iget-object v0, p0, Lcom/careless/springpod/MainActivity;->mp:Landroid/media/MediaPlayer;

    return-object v0
.end method

.method static synthetic access$1200(Lcom/careless/springpod/MainActivity;)Z
    .registers 2

    .prologue
    .line 42
    iget-boolean v0, p0, Lcom/careless/springpod/MainActivity;->prepared:Z

    return v0
.end method

.method static synthetic access$1202(Lcom/careless/springpod/MainActivity;Z)Z
    .registers 2

    .prologue
    .line 42
    iput-boolean p1, p0, Lcom/careless/springpod/MainActivity;->prepared:Z

    return p1
.end method

.method static synthetic access$1300(Lcom/careless/springpod/MainActivity;)D
    .registers 3

    .prologue
    .line 42
    iget-wide v0, p0, Lcom/careless/springpod/MainActivity;->pendingSeek:D

    return-wide v0
.end method

.method static synthetic access$1302(Lcom/careless/springpod/MainActivity;D)D
    .registers 4

    .prologue
    .line 42
    iput-wide p1, p0, Lcom/careless/springpod/MainActivity;->pendingSeek:D

    return-wide p1
.end method

.method static synthetic access$1400(Lcom/careless/springpod/MainActivity;)F
    .registers 2

    .prologue
    .line 42
    iget v0, p0, Lcom/careless/springpod/MainActivity;->vol:F

    return v0
.end method

.method static synthetic access$1402(Lcom/careless/springpod/MainActivity;F)F
    .registers 2

    .prologue
    .line 42
    iput p1, p0, Lcom/careless/springpod/MainActivity;->vol:F

    return p1
.end method

.method static synthetic access$1500(Lcom/careless/springpod/MainActivity;)D
    .registers 3

    .prologue
    .line 42
    iget-wide v0, p0, Lcom/careless/springpod/MainActivity;->durCache:D

    return-wide v0
.end method

.method static synthetic access$1502(Lcom/careless/springpod/MainActivity;D)D
    .registers 4

    .prologue
    .line 42
    iput-wide p1, p0, Lcom/careless/springpod/MainActivity;->durCache:D

    return-wide p1
.end method

.method static synthetic access$1600(Lcom/careless/springpod/MainActivity;Ljava/lang/String;)V
    .registers 2

    .prologue
    .line 42
    invoke-direct {p0, p1}, Lcom/careless/springpod/MainActivity;->js(Ljava/lang/String;)V

    return-void
.end method

.method static synthetic access$1700(Lcom/careless/springpod/MainActivity;Landroid/net/Uri;Ljava/lang/String;)Ljava/lang/String;
    .registers 4
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/io/IOException;
        }
    .end annotation

    .prologue
    .line 42
    invoke-direct {p0, p1, p2}, Lcom/careless/springpod/MainActivity;->copyIn(Landroid/net/Uri;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method static synthetic access$1800(Lcom/careless/springpod/MainActivity;)Landroid/webkit/WebView;
    .registers 2

    .prologue
    .line 42
    iget-object v0, p0, Lcom/careless/springpod/MainActivity;->web:Landroid/webkit/WebView;

    return-object v0
.end method

.method static synthetic access$200(Lcom/careless/springpod/MainActivity;Ljava/lang/String;)Ljava/io/File;
    .registers 3

    .prologue
    .line 42
    invoke-direct {p0, p1}, Lcom/careless/springpod/MainActivity;->safe(Ljava/lang/String;)Ljava/io/File;

    move-result-object v0

    return-object v0
.end method

.method static synthetic access$300(Lcom/careless/springpod/MainActivity;)Ljava/io/File;
    .registers 2

    .prologue
    .line 42
    iget-object v0, p0, Lcom/careless/springpod/MainActivity;->root:Ljava/io/File;

    return-object v0
.end method

.method static synthetic access$400(Ljava/io/File;)V
    .registers 1

    .prologue
    .line 42
    invoke-static {p0}, Lcom/careless/springpod/MainActivity;->deleteRec(Ljava/io/File;)V

    return-void
.end method

.method static synthetic access$502(Lcom/careless/springpod/MainActivity;I)I
    .registers 2

    .prologue
    .line 42
    iput p1, p0, Lcom/careless/springpod/MainActivity;->impId:I

    return p1
.end method

.method static synthetic access$602(Lcom/careless/springpod/MainActivity;Ljava/lang/String;)Ljava/lang/String;
    .registers 2

    .prologue
    .line 42
    iput-object p1, p0, Lcom/careless/springpod/MainActivity;->impTo:Ljava/lang/String;

    return-object p1
.end method

.method static synthetic access$700(Lcom/careless/springpod/MainActivity;ILjava/lang/String;Ljava/lang/String;)V
    .registers 4

    .prologue
    .line 42
    invoke-direct {p0, p1, p2, p3}, Lcom/careless/springpod/MainActivity;->importDone(ILjava/lang/String;Ljava/lang/String;)V

    return-void
.end method

.method static synthetic access$800(Lcom/careless/springpod/MainActivity;Ljava/lang/String;Z)V
    .registers 3

    .prologue
    .line 42
    invoke-direct {p0, p1, p2}, Lcom/careless/springpod/MainActivity;->startMusic(Ljava/lang/String;Z)V

    return-void
.end method

.method static synthetic access$900(Lcom/careless/springpod/MainActivity;)Landroid/os/Handler;
    .registers 2

    .prologue
    .line 42
    iget-object v0, p0, Lcom/careless/springpod/MainActivity;->ui:Landroid/os/Handler;

    return-object v0
.end method

.method private copyIn(Landroid/net/Uri;Ljava/lang/String;)Ljava/lang/String;
    .registers 13
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/io/IOException;
        }
    .end annotation

    .prologue
    const/16 v9, 0x5f

    const/4 v6, 0x1

    const/4 v8, 0x0

    const/4 v7, 0x0

    .line 372
    .line 375
    :try_start_5
    invoke-virtual {p0}, Lcom/careless/springpod/MainActivity;->getContentResolver()Landroid/content/ContentResolver;

    move-result-object v0

    const/4 v1, 0x1

    new-array v2, v1, [Ljava/lang/String;

    const/4 v1, 0x0

    const-string v3, "_display_name"

    aput-object v3, v2, v1

    const/4 v3, 0x0

    const/4 v4, 0x0

    const/4 v5, 0x0

    move-object v1, p1

    invoke-virtual/range {v0 .. v5}, Landroid/content/ContentResolver;->query(Landroid/net/Uri;[Ljava/lang/String;Ljava/lang/String;[Ljava/lang/String;Ljava/lang/String;)Landroid/database/Cursor;
    :try_end_18
    .catch Ljava/lang/Throwable; {:try_start_5 .. :try_end_18} :catch_b3
    .catchall {:try_start_5 .. :try_end_18} :catchall_bd

    move-result-object v0

    .line 376
    if-eqz v0, :cond_26

    :try_start_1b
    invoke-interface {v0}, Landroid/database/Cursor;->moveToFirst()Z

    move-result v1

    if-eqz v1, :cond_26

    const/4 v1, 0x0

    invoke-interface {v0, v1}, Landroid/database/Cursor;->getString(I)Ljava/lang/String;
    :try_end_25
    .catch Ljava/lang/Throwable; {:try_start_1b .. :try_end_25} :catch_15f
    .catchall {:try_start_1b .. :try_end_25} :catchall_15b

    move-result-object v7

    .line 378
    :cond_26
    if-eqz v0, :cond_168

    invoke-interface {v0}, Landroid/database/Cursor;->close()V

    move-object v0, v7

    .line 379
    :goto_2c
    if-eqz v0, :cond_34

    invoke-virtual {v0}, Ljava/lang/String;->length()I

    move-result v1

    if-nez v1, :cond_51

    :cond_34
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    const-string v1, "song_"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v2

    invoke-virtual {v0, v2, v3}, Ljava/lang/StringBuilder;->append(J)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, ".mp3"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    .line 380
    :cond_51
    const/16 v1, 0x2f

    invoke-virtual {v0, v1, v9}, Ljava/lang/String;->replace(CC)Ljava/lang/String;

    move-result-object v0

    const/16 v1, 0x5c

    invoke-virtual {v0, v1, v9}, Ljava/lang/String;->replace(CC)Ljava/lang/String;

    move-result-object v2

    .line 381
    const-string v0, "."

    invoke-virtual {v2, v0}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_78

    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    const-string v1, "_"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    .line 382
    :cond_78
    if-nez p2, :cond_7c

    const-string p2, ""

    .line 383
    :cond_7c
    invoke-virtual {p2}, Ljava/lang/String;->length()I

    move-result v0

    if-lez v0, :cond_9d

    const-string v0, "/"

    invoke-virtual {p2, v0}, Ljava/lang/String;->endsWith(Ljava/lang/String;)Z

    move-result v0

    if-nez v0, :cond_9d

    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v0, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, "/"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p2

    .line 384
    :cond_9d
    invoke-virtual {p2}, Ljava/lang/String;->length()I

    move-result v0

    if-nez v0, :cond_c5

    const-string v0, "."

    :goto_a5
    invoke-direct {p0, v0}, Lcom/careless/springpod/MainActivity;->safe(Ljava/lang/String;)Ljava/io/File;

    move-result-object v4

    .line 385
    if-nez v4, :cond_c7

    new-instance v0, Ljava/io/IOException;

    const-string v1, "bad destination"

    invoke-direct {v0, v1}, Ljava/io/IOException;-><init>(Ljava/lang/String;)V

    throw v0

    .line 377
    :catch_b3
    move-exception v0

    move-object v0, v7

    .line 378
    :goto_b5
    if-eqz v0, :cond_165

    invoke-interface {v0}, Landroid/database/Cursor;->close()V

    move-object v0, v7

    goto/16 :goto_2c

    :catchall_bd
    move-exception v0

    move-object v1, v0

    :goto_bf
    if-eqz v7, :cond_c4

    invoke-interface {v7}, Landroid/database/Cursor;->close()V

    :cond_c4
    throw v1

    :cond_c5
    move-object v0, p2

    .line 384
    goto :goto_a5

    .line 386
    :cond_c7
    invoke-virtual {v4}, Ljava/io/File;->mkdirs()Z

    .line 387
    const-string v0, ""

    .line 388
    const/16 v1, 0x2e

    invoke-virtual {v2, v1}, Ljava/lang/String;->lastIndexOf(I)I

    move-result v3

    .line 389
    if-lez v3, :cond_162

    invoke-virtual {v2, v8, v3}, Ljava/lang/String;->substring(II)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v2, v3}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object v0

    .line 390
    :goto_dc
    new-instance v3, Ljava/io/File;

    invoke-direct {v3, v4, v2}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    move v2, v6

    .line 392
    :goto_e2
    invoke-virtual {v3}, Ljava/io/File;->exists()Z

    move-result v5

    if-eqz v5, :cond_111

    new-instance v3, Ljava/io/File;

    new-instance v5, Ljava/lang/StringBuilder;

    invoke-direct {v5}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v5, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    const-string v6, " ("

    invoke-virtual {v5, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    add-int/lit8 v2, v2, 0x1

    invoke-virtual {v5, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v5

    const-string v6, ")"

    invoke-virtual {v5, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v5

    invoke-direct {v3, v4, v5}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    goto :goto_e2

    .line 393
    :cond_111
    invoke-virtual {p0}, Lcom/careless/springpod/MainActivity;->getContentResolver()Landroid/content/ContentResolver;

    move-result-object v0

    invoke-virtual {v0, p1}, Landroid/content/ContentResolver;->openInputStream(Landroid/net/Uri;)Ljava/io/InputStream;

    move-result-object v1

    .line 394
    if-nez v1, :cond_123

    new-instance v0, Ljava/io/IOException;

    const-string v1, "cannot open file"

    invoke-direct {v0, v1}, Ljava/io/IOException;-><init>(Ljava/lang/String;)V

    throw v0

    .line 395
    :cond_123
    new-instance v2, Ljava/io/FileOutputStream;

    invoke-direct {v2, v3}, Ljava/io/FileOutputStream;-><init>(Ljava/io/File;)V

    .line 397
    const/high16 v0, 0x10000

    :try_start_12a
    new-array v0, v0, [B

    .line 398
    :goto_12c
    invoke-virtual {v1, v0}, Ljava/io/InputStream;->read([B)I

    move-result v4

    if-lez v4, :cond_13f

    const/4 v5, 0x0

    invoke-virtual {v2, v0, v5, v4}, Ljava/io/OutputStream;->write([BII)V
    :try_end_136
    .catchall {:try_start_12a .. :try_end_136} :catchall_137

    goto :goto_12c

    .line 399
    :catchall_137
    move-exception v0

    invoke-virtual {v2}, Ljava/io/OutputStream;->close()V

    invoke-virtual {v1}, Ljava/io/InputStream;->close()V

    throw v0

    :cond_13f
    invoke-virtual {v2}, Ljava/io/OutputStream;->close()V

    invoke-virtual {v1}, Ljava/io/InputStream;->close()V

    .line 400
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v0, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v3}, Ljava/io/File;->getName()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    return-object v0

    .line 378
    :catchall_15b
    move-exception v1

    move-object v7, v0

    goto/16 :goto_bf

    .line 377
    :catch_15f
    move-exception v1

    goto/16 :goto_b5

    :cond_162
    move-object v1, v2

    goto/16 :goto_dc

    :cond_165
    move-object v0, v7

    goto/16 :goto_2c

    :cond_168
    move-object v0, v7

    goto/16 :goto_2c
.end method

.method private static deleteRec(Ljava/io/File;)V
    .registers 5

    .prologue
    .line 185
    invoke-virtual {p0}, Ljava/io/File;->isDirectory()Z

    move-result v0

    if-eqz v0, :cond_18

    invoke-virtual {p0}, Ljava/io/File;->listFiles()[Ljava/io/File;

    move-result-object v1

    if-eqz v1, :cond_18

    array-length v2, v1

    const/4 v0, 0x0

    :goto_e
    if-ge v0, v2, :cond_18

    aget-object v3, v1, v0

    invoke-static {v3}, Lcom/careless/springpod/MainActivity;->deleteRec(Ljava/io/File;)V

    add-int/lit8 v0, v0, 0x1

    goto :goto_e

    .line 186
    :cond_18
    invoke-virtual {p0}, Ljava/io/File;->delete()Z

    .line 187
    return-void
.end method

.method private hideBars()V
    .registers 3

    .prologue
    .line 101
    invoke-virtual {p0}, Lcom/careless/springpod/MainActivity;->getWindow()Landroid/view/Window;

    move-result-object v0

    invoke-virtual {v0}, Landroid/view/Window;->getDecorView()Landroid/view/View;

    move-result-object v0

    const/16 v1, 0x1006

    invoke-virtual {v0, v1}, Landroid/view/View;->setSystemUiVisibility(I)V

    .line 105
    return-void
.end method

.method private importDone(ILjava/lang/String;Ljava/lang/String;)V
    .registers 6

    .prologue
    .line 404
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    const-string v1, "window.__spImportDone("

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, ","

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-static {p2}, Lorg/json/JSONObject;->quote(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, ","

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    if-nez p3, :cond_39

    const-string v0, "null"

    :goto_27
    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, ")"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-direct {p0, v0}, Lcom/careless/springpod/MainActivity;->js(Ljava/lang/String;)V

    .line 405
    return-void

    .line 404
    :cond_39
    invoke-static {p3}, Lorg/json/JSONObject;->quote(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    goto :goto_27
.end method

.method private js(Ljava/lang/String;)V
    .registers 3

    .prologue
    .line 408
    new-instance v0, Lcom/careless/springpod/MainActivity$6;

    invoke-direct {v0, p0, p1}, Lcom/careless/springpod/MainActivity$6;-><init>(Lcom/careless/springpod/MainActivity;Ljava/lang/String;)V

    invoke-virtual {p0, v0}, Lcom/careless/springpod/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 411
    return-void
.end method

.method private static mime(Ljava/lang/String;)Ljava/lang/String;
    .registers 3

    .prologue
    .line 161
    invoke-virtual {p0}, Ljava/lang/String;->toLowerCase()Ljava/lang/String;

    move-result-object v0

    .line 162
    const-string v1, ".html"

    invoke-virtual {v0, v1}, Ljava/lang/String;->endsWith(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_f

    const-string v0, "text/html"

    .line 170
    :goto_e
    return-object v0

    .line 163
    :cond_f
    const-string v1, ".js"

    invoke-virtual {v0, v1}, Ljava/lang/String;->endsWith(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_1a

    const-string v0, "application/javascript"

    goto :goto_e

    .line 164
    :cond_1a
    const-string v1, ".png"

    invoke-virtual {v0, v1}, Ljava/lang/String;->endsWith(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_25

    const-string v0, "image/png"

    goto :goto_e

    .line 165
    :cond_25
    const-string v1, ".jpg"

    invoke-virtual {v0, v1}, Ljava/lang/String;->endsWith(Ljava/lang/String;)Z

    move-result v1

    if-nez v1, :cond_35

    const-string v1, ".jpeg"

    invoke-virtual {v0, v1}, Ljava/lang/String;->endsWith(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_38

    :cond_35
    const-string v0, "image/jpeg"

    goto :goto_e

    .line 166
    :cond_38
    const-string v1, ".gif"

    invoke-virtual {v0, v1}, Ljava/lang/String;->endsWith(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_43

    const-string v0, "image/gif"

    goto :goto_e

    .line 167
    :cond_43
    const-string v1, ".webp"

    invoke-virtual {v0, v1}, Ljava/lang/String;->endsWith(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_4e

    const-string v0, "image/webp"

    goto :goto_e

    .line 168
    :cond_4e
    const-string v1, ".bmp"

    invoke-virtual {v0, v1}, Ljava/lang/String;->endsWith(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_59

    const-string v0, "image/bmp"

    goto :goto_e

    .line 169
    :cond_59
    const-string v1, ".mp3"

    invoke-virtual {v0, v1}, Ljava/lang/String;->endsWith(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_64

    const-string v0, "audio/mpeg"

    goto :goto_e

    .line 170
    :cond_64
    const-string v0, "application/octet-stream"

    goto :goto_e
.end method

.method private notFound()Landroid/webkit/WebResourceResponse;
    .registers 9

    .prologue
    .line 156
    new-instance v0, Landroid/webkit/WebResourceResponse;

    const-string v1, "text/plain"

    const-string v2, "utf-8"

    const/16 v3, 0x194

    const-string v4, "Not Found"

    new-instance v5, Ljava/util/HashMap;

    invoke-direct {v5}, Ljava/util/HashMap;-><init>()V

    new-instance v6, Ljava/io/ByteArrayInputStream;

    const/4 v7, 0x0

    new-array v7, v7, [B

    invoke-direct {v6, v7}, Ljava/io/ByteArrayInputStream;-><init>([B)V

    invoke-direct/range {v0 .. v6}, Landroid/webkit/WebResourceResponse;-><init>(Ljava/lang/String;Ljava/lang/String;ILjava/lang/String;Ljava/util/Map;Ljava/io/InputStream;)V

    return-object v0
.end method

.method private releasePlayer()V
    .registers 5

    .prologue
    const/4 v1, 0x0

    .line 278
    iget-object v0, p0, Lcom/careless/springpod/MainActivity;->mp:Landroid/media/MediaPlayer;

    .line 279
    iput-object v1, p0, Lcom/careless/springpod/MainActivity;->mp:Landroid/media/MediaPlayer;

    const/4 v1, 0x0

    iput-boolean v1, p0, Lcom/careless/springpod/MainActivity;->prepared:Z

    const-wide/high16 v2, -0x4010000000000000L    # -1.0

    iput-wide v2, p0, Lcom/careless/springpod/MainActivity;->pendingSeek:D

    const-wide/16 v2, 0x0

    iput-wide v2, p0, Lcom/careless/springpod/MainActivity;->durCache:D

    .line 280
    if-eqz v0, :cond_24

    .line 281
    const/4 v1, 0x0

    :try_start_13
    invoke-virtual {v0, v1}, Landroid/media/MediaPlayer;->setOnCompletionListener(Landroid/media/MediaPlayer$OnCompletionListener;)V

    const/4 v1, 0x0

    invoke-virtual {v0, v1}, Landroid/media/MediaPlayer;->setOnPreparedListener(Landroid/media/MediaPlayer$OnPreparedListener;)V

    const/4 v1, 0x0

    invoke-virtual {v0, v1}, Landroid/media/MediaPlayer;->setOnErrorListener(Landroid/media/MediaPlayer$OnErrorListener;)V

    invoke-virtual {v0}, Landroid/media/MediaPlayer;->reset()V
    :try_end_21
    .catch Ljava/lang/Throwable; {:try_start_13 .. :try_end_21} :catch_27

    .line 282
    :goto_21
    :try_start_21
    invoke-virtual {v0}, Landroid/media/MediaPlayer;->release()V
    :try_end_24
    .catch Ljava/lang/Throwable; {:try_start_21 .. :try_end_24} :catch_25

    .line 284
    :cond_24
    :goto_24
    return-void

    .line 282
    :catch_25
    move-exception v0

    goto :goto_24

    .line 281
    :catch_27
    move-exception v1

    goto :goto_21
.end method

.method private safe(Ljava/lang/String;)Ljava/io/File;
    .registers 7

    .prologue
    const/4 v0, 0x0

    .line 175
    if-nez p1, :cond_4

    .line 181
    :cond_3
    :goto_3
    return-object v0

    .line 177
    :cond_4
    :try_start_4
    new-instance v1, Ljava/io/File;

    iget-object v2, p0, Lcom/careless/springpod/MainActivity;->root:Ljava/io/File;

    invoke-direct {v1, v2, p1}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    invoke-virtual {v1}, Ljava/io/File;->getCanonicalFile()Ljava/io/File;

    move-result-object v1

    .line 178
    iget-object v2, p0, Lcom/careless/springpod/MainActivity;->root:Ljava/io/File;

    invoke-virtual {v2}, Ljava/io/File;->getCanonicalPath()Ljava/lang/String;

    move-result-object v2

    .line 179
    invoke-virtual {v1}, Ljava/io/File;->getPath()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v3, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-nez v3, :cond_3c

    invoke-virtual {v1}, Ljava/io/File;->getPath()Ljava/lang/String;

    move-result-object v3

    new-instance v4, Ljava/lang/StringBuilder;

    invoke-direct {v4}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v4, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    sget-object v4, Ljava/io/File;->separator:Ljava/lang/String;

    invoke-virtual {v2, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v3, v2}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z
    :try_end_39
    .catch Ljava/io/IOException; {:try_start_4 .. :try_end_39} :catch_3e

    move-result v2

    if-eqz v2, :cond_3

    :cond_3c
    move-object v0, v1

    goto :goto_3

    .line 180
    :catch_3e
    move-exception v1

    goto :goto_3
.end method

.method private serve(Landroid/net/Uri;)Landroid/webkit/WebResourceResponse;
    .registers 9

    .prologue
    .line 130
    const-string v0, "appassets.local"

    invoke-virtual {p1}, Landroid/net/Uri;->getHost()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_11

    const/4 v0, 0x0

    nop

    nop

    nop

    .line 151
    :goto_10
    return-object v0

    .line 131
    :cond_11
    invoke-virtual {p1}, Landroid/net/Uri;->getPath()Ljava/lang/String;

    move-result-object v0

    .line 132
    if-eqz v0, :cond_25

    const-string v1, "/"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_25

    invoke-virtual {v0}, Ljava/lang/String;->length()I

    move-result v1

    if-nez v1, :cond_e4

    :cond_25
    const-string v0, "/index.html"

    move-object v1, v0

    .line 133
    :goto_28
    const-string v0, ".."

    invoke-virtual {v1, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-eqz v0, :cond_35

    invoke-direct {p0}, Lcom/careless/springpod/MainActivity;->notFound()Landroid/webkit/WebResourceResponse;

    move-result-object v0

    goto :goto_10

    .line 136
    :cond_35
    :try_start_35
    const-string v0, "/files/"

    invoke-virtual {v1, v0}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_82

    .line 137
    const/4 v0, 0x7

    invoke-virtual {v1, v0}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object v0

    invoke-direct {p0, v0}, Lcom/careless/springpod/MainActivity;->safe(Ljava/lang/String;)Ljava/io/File;

    move-result-object v0

    .line 138
    if-eqz v0, :cond_4e

    invoke-virtual {v0}, Ljava/io/File;->isFile()Z

    move-result v2

    if-nez v2, :cond_53

    :cond_4e
    invoke-direct {p0}, Lcom/careless/springpod/MainActivity;->notFound()Landroid/webkit/WebResourceResponse;

    move-result-object v0

    goto :goto_10

    .line 139
    :cond_53
    new-instance v6, Ljava/io/FileInputStream;

    invoke-direct {v6, v0}, Ljava/io/FileInputStream;-><init>(Ljava/io/File;)V

    .line 147
    :goto_58
    new-instance v5, Ljava/util/HashMap;

    invoke-direct {v5}, Ljava/util/HashMap;-><init>()V

    .line 148
    const-string v2, "Cache-Control"

    const-string v0, "/files/"

    invoke-virtual {v1, v0}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_e1

    const-string v0, "no-cache"

    :goto_69
    invoke-interface {v5, v2, v0}, Ljava/util/Map;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 149
    new-instance v0, Landroid/webkit/WebResourceResponse;

    invoke-static {v1}, Lcom/careless/springpod/MainActivity;->mime(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    const-string v2, "utf-8"

    const/16 v3, 0xc8

    const-string v4, "OK"

    invoke-direct/range {v0 .. v6}, Landroid/webkit/WebResourceResponse;-><init>(Ljava/lang/String;Ljava/lang/String;ILjava/lang/String;Ljava/util/Map;Ljava/io/InputStream;)V
    :try_end_7b
    .catch Ljava/io/IOException; {:try_start_35 .. :try_end_7b} :catch_7c

    goto :goto_10

    .line 150
    :catch_7c
    move-exception v0

    .line 151
    invoke-direct {p0}, Lcom/careless/springpod/MainActivity;->notFound()Landroid/webkit/WebResourceResponse;

    move-result-object v0

    goto :goto_10

    .line 140
    :cond_82
    :try_start_82
    const-string v0, "/index.html"

    invoke-virtual {v1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_9a

    const-string v0, "/runtime.js"

    invoke-virtual {v1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_9a

    const-string v0, "/bundle.js"

    invoke-virtual {v1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_b6

    .line 141
    :cond_9a
    invoke-virtual {p0}, Lcom/careless/springpod/MainActivity;->getAssets()Landroid/content/res/AssetManager;

    move-result-object v0

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    const-string v3, "www"

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v0, v2}, Landroid/content/res/AssetManager;->open(Ljava/lang/String;)Ljava/io/InputStream;

    move-result-object v6

    goto :goto_58

    .line 142
    :cond_b6
    const-string v0, "/assets/"

    invoke-virtual {v1, v0}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_db

    .line 143
    invoke-virtual {p0}, Lcom/careless/springpod/MainActivity;->getAssets()Landroid/content/res/AssetManager;

    move-result-object v0

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    const-string v3, "app"

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v0, v2}, Landroid/content/res/AssetManager;->open(Ljava/lang/String;)Ljava/io/InputStream;

    move-result-object v6

    goto/16 :goto_58

    .line 145
    :cond_db
    invoke-direct {p0}, Lcom/careless/springpod/MainActivity;->notFound()Landroid/webkit/WebResourceResponse;

    move-result-object v0

    goto/16 :goto_10

    .line 148
    :cond_e1
    const-string v0, "max-age=3600"
    :try_end_e3
    .catch Ljava/io/IOException; {:try_start_82 .. :try_end_e3} :catch_7c

    goto :goto_69

    :cond_e4
    move-object v1, v0

    goto/16 :goto_28
.end method

.method private startMusic(Ljava/lang/String;Z)V
    .registers 10

    .prologue
    .line 287
    invoke-direct {p0}, Lcom/careless/springpod/MainActivity;->releasePlayer()V

    .line 288
    new-instance v0, Landroid/media/MediaPlayer;

    invoke-direct {v0}, Landroid/media/MediaPlayer;-><init>()V

    .line 289
    iput-object v0, p0, Lcom/careless/springpod/MainActivity;->mp:Landroid/media/MediaPlayer;

    .line 291
    :try_start_a
    const-string v1, "files/"

    invoke-virtual {p1, v1}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_82

    .line 292
    const/4 v1, 0x6

    invoke-virtual {p1, v1}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object v1

    invoke-direct {p0, v1}, Lcom/careless/springpod/MainActivity;->safe(Ljava/lang/String;)Ljava/io/File;

    move-result-object v1

    .line 293
    new-instance v2, Ljava/io/FileInputStream;

    invoke-direct {v2, v1}, Ljava/io/FileInputStream;-><init>(Ljava/io/File;)V
    :try_end_20
    .catch Ljava/lang/Throwable; {:try_start_a .. :try_end_20} :catch_61

    .line 294
    :try_start_20
    invoke-virtual {v2}, Ljava/io/FileInputStream;->getFD()Ljava/io/FileDescriptor;

    move-result-object v1

    invoke-virtual {v0, v1}, Landroid/media/MediaPlayer;->setDataSource(Ljava/io/FileDescriptor;)V
    :try_end_27
    .catchall {:try_start_20 .. :try_end_27} :catchall_5c

    :try_start_27
    invoke-virtual {v2}, Ljava/io/FileInputStream;->close()V

    .line 313
    :goto_2a
    const/4 v1, 0x3

    invoke-virtual {v0, v1}, Landroid/media/MediaPlayer;->setAudioStreamType(I)V

    .line 314
    iget v1, p0, Lcom/careless/springpod/MainActivity;->vol:F

    iget v2, p0, Lcom/careless/springpod/MainActivity;->vol:F

    invoke-virtual {v0, v1, v2}, Landroid/media/MediaPlayer;->setVolume(FF)V

    .line 315
    invoke-virtual {v0, p2}, Landroid/media/MediaPlayer;->setLooping(Z)V

    .line 316
    invoke-virtual {p0}, Lcom/careless/springpod/MainActivity;->getApplicationContext()Landroid/content/Context;

    move-result-object v1

    const/4 v2, 0x1

    invoke-virtual {v0, v1, v2}, Landroid/media/MediaPlayer;->setWakeMode(Landroid/content/Context;I)V

    .line 317
    new-instance v1, Lcom/careless/springpod/MainActivity$2;

    invoke-direct {v1, p0}, Lcom/careless/springpod/MainActivity$2;-><init>(Lcom/careless/springpod/MainActivity;)V

    invoke-virtual {v0, v1}, Landroid/media/MediaPlayer;->setOnPreparedListener(Landroid/media/MediaPlayer$OnPreparedListener;)V

    .line 326
    new-instance v1, Lcom/careless/springpod/MainActivity$3;

    invoke-direct {v1, p0}, Lcom/careless/springpod/MainActivity$3;-><init>(Lcom/careless/springpod/MainActivity;)V

    invoke-virtual {v0, v1}, Landroid/media/MediaPlayer;->setOnCompletionListener(Landroid/media/MediaPlayer$OnCompletionListener;)V

    .line 332
    new-instance v1, Lcom/careless/springpod/MainActivity$4;

    invoke-direct {v1, p0}, Lcom/careless/springpod/MainActivity$4;-><init>(Lcom/careless/springpod/MainActivity;)V

    invoke-virtual {v0, v1}, Landroid/media/MediaPlayer;->setOnErrorListener(Landroid/media/MediaPlayer$OnErrorListener;)V

    .line 339
    invoke-virtual {v0}, Landroid/media/MediaPlayer;->prepareAsync()V

    .line 344
    :cond_5b
    :goto_5b
    return-void

    .line 294
    :catchall_5c
    move-exception v1

    invoke-virtual {v2}, Ljava/io/FileInputStream;->close()V

    throw v1
    :try_end_61
    .catch Ljava/lang/Throwable; {:try_start_27 .. :try_end_61} :catch_61

    .line 340
    :catch_61
    move-exception v1

    .line 341
    const-string v2, "SpringPod"

    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3}, Ljava/lang/StringBuilder;-><init>()V

    const-string v4, "play failed: "

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2, v3, v1}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    .line 342
    iget-object v1, p0, Lcom/careless/springpod/MainActivity;->mp:Landroid/media/MediaPlayer;

    if-ne v1, v0, :cond_5b

    invoke-direct {p0}, Lcom/careless/springpod/MainActivity;->releasePlayer()V

    goto :goto_5b

    .line 297
    :cond_82
    :try_start_82
    invoke-virtual {p0}, Lcom/careless/springpod/MainActivity;->getAssets()Landroid/content/res/AssetManager;

    move-result-object v1

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    const-string v3, "app/"

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v1, v2}, Landroid/content/res/AssetManager;->openFd(Ljava/lang/String;)Landroid/content/res/AssetFileDescriptor;
    :try_end_9c
    .catch Ljava/io/FileNotFoundException; {:try_start_82 .. :try_end_9c} :catch_b1
    .catch Ljava/lang/Throwable; {:try_start_82 .. :try_end_9c} :catch_61

    move-result-object v6

    .line 298
    :try_start_9d
    invoke-virtual {v6}, Landroid/content/res/AssetFileDescriptor;->getFileDescriptor()Ljava/io/FileDescriptor;

    move-result-object v1

    invoke-virtual {v6}, Landroid/content/res/AssetFileDescriptor;->getStartOffset()J

    move-result-wide v2

    invoke-virtual {v6}, Landroid/content/res/AssetFileDescriptor;->getLength()J

    move-result-wide v4

    invoke-virtual/range {v0 .. v5}, Landroid/media/MediaPlayer;->setDataSource(Ljava/io/FileDescriptor;JJ)V
    :try_end_ac
    .catchall {:try_start_9d .. :try_end_ac} :catchall_111

    .line 299
    :try_start_ac
    invoke-virtual {v6}, Landroid/content/res/AssetFileDescriptor;->close()V
    :try_end_af
    .catch Ljava/io/FileNotFoundException; {:try_start_ac .. :try_end_af} :catch_b1
    .catch Ljava/lang/Throwable; {:try_start_ac .. :try_end_af} :catch_61

    goto/16 :goto_2a

    .line 300
    :catch_b1
    move-exception v1

    .line 302
    :try_start_b2
    new-instance v1, Ljava/io/File;

    invoke-virtual {p0}, Lcom/careless/springpod/MainActivity;->getCacheDir()Ljava/io/File;

    move-result-object v2

    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3}, Ljava/lang/StringBuilder;-><init>()V

    const-string v4, "play_"

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {p1}, Ljava/lang/String;->hashCode()I

    move-result v4

    invoke-static {v4}, Ljava/lang/Math;->abs(I)I

    move-result v4

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v3

    const-string v4, ".mp3"

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-direct {v1, v2, v3}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    .line 303
    invoke-virtual {v1}, Ljava/io/File;->exists()Z

    move-result v2

    if-nez v2, :cond_11c

    .line 304
    invoke-virtual {p0}, Lcom/careless/springpod/MainActivity;->getAssets()Landroid/content/res/AssetManager;

    move-result-object v2

    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3}, Ljava/lang/StringBuilder;-><init>()V

    const-string v4, "app/"

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Landroid/content/res/AssetManager;->open(Ljava/lang/String;)Ljava/io/InputStream;

    move-result-object v2

    .line 305
    new-instance v3, Ljava/io/FileOutputStream;

    invoke-direct {v3, v1}, Ljava/io/FileOutputStream;-><init>(Ljava/io/File;)V

    .line 306
    const/high16 v4, 0x10000

    new-array v4, v4, [B

    .line 307
    :goto_106
    invoke-virtual {v2, v4}, Ljava/io/InputStream;->read([B)I

    move-result v5

    if-lez v5, :cond_116

    const/4 v6, 0x0

    invoke-virtual {v3, v4, v6, v5}, Ljava/io/OutputStream;->write([BII)V
    :try_end_110
    .catch Ljava/lang/Throwable; {:try_start_b2 .. :try_end_110} :catch_61

    goto :goto_106

    .line 299
    :catchall_111
    move-exception v1

    :try_start_112
    invoke-virtual {v6}, Landroid/content/res/AssetFileDescriptor;->close()V

    throw v1
    :try_end_116
    .catch Ljava/io/FileNotFoundException; {:try_start_112 .. :try_end_116} :catch_b1
    .catch Ljava/lang/Throwable; {:try_start_112 .. :try_end_116} :catch_61

    .line 308
    :cond_116
    :try_start_116
    invoke-virtual {v3}, Ljava/io/OutputStream;->close()V

    invoke-virtual {v2}, Ljava/io/InputStream;->close()V

    .line 310
    :cond_11c
    invoke-virtual {v1}, Ljava/io/File;->getPath()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Landroid/media/MediaPlayer;->setDataSource(Ljava/lang/String;)V
    :try_end_123
    .catch Ljava/lang/Throwable; {:try_start_116 .. :try_end_123} :catch_61

    goto/16 :goto_2a
.end method


# virtual methods
.method protected onActivityResult(IILandroid/content/Intent;)V
    .registers 10

    .prologue
    .line 351
    invoke-super {p0, p1, p2, p3}, Landroid/app/Activity;->onActivityResult(IILandroid/content/Intent;)V

    .line 352
    const/16 v0, 0x1069

    if-eq p1, v0, :cond_8

    .line 369
    :goto_7
    return-void

    .line 353
    :cond_8
    iget v1, p0, Lcom/careless/springpod/MainActivity;->impId:I

    .line 354
    iget-object v2, p0, Lcom/careless/springpod/MainActivity;->impTo:Ljava/lang/String;

    .line 355
    const/4 v0, -0x1

    if-ne p2, v0, :cond_11

    if-nez p3, :cond_18

    :cond_11
    const-string v0, "[]"

    const/4 v2, 0x0

    invoke-direct {p0, v1, v0, v2}, Lcom/careless/springpod/MainActivity;->importDone(ILjava/lang/String;Ljava/lang/String;)V

    goto :goto_7

    .line 356
    :cond_18
    new-instance v3, Ljava/util/ArrayList;

    invoke-direct {v3}, Ljava/util/ArrayList;-><init>()V

    .line 357
    invoke-virtual {p3}, Landroid/content/Intent;->getClipData()Landroid/content/ClipData;

    move-result-object v4

    .line 358
    if-eqz v4, :cond_38

    const/4 v0, 0x0

    :goto_24
    invoke-virtual {v4}, Landroid/content/ClipData;->getItemCount()I

    move-result v5

    if-ge v0, v5, :cond_45

    invoke-virtual {v4, v0}, Landroid/content/ClipData;->getItemAt(I)Landroid/content/ClipData$Item;

    move-result-object v5

    invoke-virtual {v5}, Landroid/content/ClipData$Item;->getUri()Landroid/net/Uri;

    move-result-object v5

    invoke-interface {v3, v5}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    add-int/lit8 v0, v0, 0x1

    goto :goto_24

    .line 359
    :cond_38
    invoke-virtual {p3}, Landroid/content/Intent;->getData()Landroid/net/Uri;

    move-result-object v0

    if-eqz v0, :cond_45

    invoke-virtual {p3}, Landroid/content/Intent;->getData()Landroid/net/Uri;

    move-result-object v0

    invoke-interface {v3, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 360
    :cond_45
    new-instance v0, Ljava/lang/Thread;

    new-instance v4, Lcom/careless/springpod/MainActivity$5;

    invoke-direct {v4, p0, v3, v2, v1}, Lcom/careless/springpod/MainActivity$5;-><init>(Lcom/careless/springpod/MainActivity;Ljava/util/List;Ljava/lang/String;I)V

    invoke-direct {v0, v4}, Ljava/lang/Thread;-><init>(Ljava/lang/Runnable;)V

    .line 368
    invoke-virtual {v0}, Ljava/lang/Thread;->start()V

    goto :goto_7
.end method

.method public onBackPressed()V
    .registers 2

    .prologue
    .line 116
    const/4 v0, 0x1

    invoke-virtual {p0, v0}, Lcom/careless/springpod/MainActivity;->moveTaskToBack(Z)Z

    .line 117
    return-void
.end method

.method protected onCreate(Landroid/os/Bundle;)V
    .registers 7

    .prologue
    const/4 v4, 0x1

    const/4 v3, -0x1

    const/high16 v1, -0x1000000

    const/4 v2, 0x0

    .line 65
    invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V

    .line 66
    invoke-virtual {p0}, Lcom/careless/springpod/MainActivity;->getFilesDir()Ljava/io/File;

    move-result-object v0

    iput-object v0, p0, Lcom/careless/springpod/MainActivity;->root:Ljava/io/File;

    .line 67
    invoke-virtual {p0}, Lcom/careless/springpod/MainActivity;->getWindow()Landroid/view/Window;

    move-result-object v0

    invoke-virtual {v0, v1}, Landroid/view/Window;->setStatusBarColor(I)V

    .line 68
    invoke-virtual {p0}, Lcom/careless/springpod/MainActivity;->getWindow()Landroid/view/Window;

    move-result-object v0

    invoke-virtual {v0, v1}, Landroid/view/Window;->setNavigationBarColor(I)V

    .line 69
    invoke-direct {p0}, Lcom/careless/springpod/MainActivity;->hideBars()V

    .line 71
    new-instance v0, Landroid/webkit/WebView;

    invoke-direct {v0, p0}, Landroid/webkit/WebView;-><init>(Landroid/content/Context;)V

    iput-object v0, p0, Lcom/careless/springpod/MainActivity;->web:Landroid/webkit/WebView;

    .line 72
    iget-object v0, p0, Lcom/careless/springpod/MainActivity;->web:Landroid/webkit/WebView;

    invoke-virtual {v0, v1}, Landroid/webkit/WebView;->setBackgroundColor(I)V

    .line 73
    iget-object v0, p0, Lcom/careless/springpod/MainActivity;->web:Landroid/webkit/WebView;

    const/4 v1, 0x2

    invoke-virtual {v0, v1}, Landroid/webkit/WebView;->setOverScrollMode(I)V

    .line 74
    iget-object v0, p0, Lcom/careless/springpod/MainActivity;->web:Landroid/webkit/WebView;

    invoke-virtual {v0, v2}, Landroid/webkit/WebView;->setVerticalScrollBarEnabled(Z)V

    .line 75
    iget-object v0, p0, Lcom/careless/springpod/MainActivity;->web:Landroid/webkit/WebView;

    invoke-virtual {v0, v2}, Landroid/webkit/WebView;->setHorizontalScrollBarEnabled(Z)V

    .line 76
    iget-object v0, p0, Lcom/careless/springpod/MainActivity;->web:Landroid/webkit/WebView;

    invoke-virtual {v0}, Landroid/webkit/WebView;->getSettings()Landroid/webkit/WebSettings;

    move-result-object v0

    .line 77
    invoke-virtual {v0, v4}, Landroid/webkit/WebSettings;->setJavaScriptEnabled(Z)V

    .line 78
    invoke-virtual {v0, v4}, Landroid/webkit/WebSettings;->setDomStorageEnabled(Z)V

    .line 79
    invoke-virtual {v0, v2}, Landroid/webkit/WebSettings;->setAllowFileAccess(Z)V

    .line 80
    invoke-virtual {v0, v2}, Landroid/webkit/WebSettings;->setAllowContentAccess(Z)V

    .line 81
    invoke-virtual {v0, v2}, Landroid/webkit/WebSettings;->setMediaPlaybackRequiresUserGesture(Z)V

    .line 82
    invoke-virtual {v0, v2}, Landroid/webkit/WebSettings;->setSupportZoom(Z)V

    .line 83
    invoke-virtual {v0, v3}, Landroid/webkit/WebSettings;->setCacheMode(I)V

    .line 84
    iget-object v0, p0, Lcom/careless/springpod/MainActivity;->web:Landroid/webkit/WebView;

    new-instance v1, Lcom/careless/springpod/MainActivity$Bridge;

    const/4 v2, 0x0

    invoke-direct {v1, p0, v2}, Lcom/careless/springpod/MainActivity$Bridge;-><init>(Lcom/careless/springpod/MainActivity;Lcom/careless/springpod/MainActivity$1;)V

    const-string v2, "Native"

    invoke-virtual {v0, v1, v2}, Landroid/webkit/WebView;->addJavascriptInterface(Ljava/lang/Object;Ljava/lang/String;)V

    .line 85
    iget-object v0, p0, Lcom/careless/springpod/MainActivity;->web:Landroid/webkit/WebView;

    new-instance v1, Lcom/careless/springpod/MainActivity$1;

    invoke-direct {v1, p0}, Lcom/careless/springpod/MainActivity$1;-><init>(Lcom/careless/springpod/MainActivity;)V

    invoke-virtual {v0, v1}, Landroid/webkit/WebView;->setWebViewClient(Landroid/webkit/WebViewClient;)V

    .line 91
    iget-object v0, p0, Lcom/careless/springpod/MainActivity;->web:Landroid/webkit/WebView;

    new-instance v1, Landroid/view/ViewGroup$LayoutParams;

    invoke-direct {v1, v3, v3}, Landroid/view/ViewGroup$LayoutParams;-><init>(II)V

    invoke-virtual {p0, v0, v1}, Lcom/careless/springpod/MainActivity;->setContentView(Landroid/view/View;Landroid/view/ViewGroup$LayoutParams;)V

    .line 92
    iget-object v0, p0, Lcom/careless/springpod/MainActivity;->web:Landroid/webkit/WebView;

    const-string v1, "https://appassets.local/index.html"

    invoke-virtual {v0, v1}, Landroid/webkit/WebView;->loadUrl(Ljava/lang/String;)V

    .line 93
    return-void
.end method

.method protected onDestroy()V
    .registers 2

    .prologue
    .line 121
    invoke-direct {p0}, Lcom/careless/springpod/MainActivity;->releasePlayer()V

    .line 122
    iget-object v0, p0, Lcom/careless/springpod/MainActivity;->web:Landroid/webkit/WebView;

    if-eqz v0, :cond_f

    iget-object v0, p0, Lcom/careless/springpod/MainActivity;->web:Landroid/webkit/WebView;

    invoke-virtual {v0}, Landroid/webkit/WebView;->destroy()V

    const/4 v0, 0x0

    iput-object v0, p0, Lcom/careless/springpod/MainActivity;->web:Landroid/webkit/WebView;

    .line 123
    :cond_f
    invoke-super {p0}, Landroid/app/Activity;->onDestroy()V

    .line 124
    return-void
.end method

.method protected onSaveInstanceState(Landroid/os/Bundle;)V
    .registers 2

    .prologue
    .line 97
    invoke-super {p0, p1}, Landroid/app/Activity;->onSaveInstanceState(Landroid/os/Bundle;)V

    .line 98
    return-void
.end method

.method public onWindowFocusChanged(Z)V
    .registers 2

    .prologue
    .line 109
    invoke-super {p0, p1}, Landroid/app/Activity;->onWindowFocusChanged(Z)V

    .line 110
    if-eqz p1, :cond_8

    invoke-direct {p0}, Lcom/careless/springpod/MainActivity;->hideBars()V

    .line 111
    :cond_8
    return-void
.end method

###### Class com.careless.springpod.MainActivity.AnonymousClass1 (com.careless.springpod.MainActivity$1)
.class Lcom/careless/springpod/MainActivity$1;
.super Landroid/webkit/WebViewClient;
.source "MainActivity.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/careless/springpod/MainActivity;->onCreate(Landroid/os/Bundle;)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/careless/springpod/MainActivity;


# direct methods
.method constructor <init>(Lcom/careless/springpod/MainActivity;)V
    .registers 2

    .prologue
    .line 85
    iput-object p1, p0, Lcom/careless/springpod/MainActivity$1;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-direct {p0}, Landroid/webkit/WebViewClient;-><init>()V

    return-void
.end method


# virtual methods
.method public shouldInterceptRequest(Landroid/webkit/WebView;Landroid/webkit/WebResourceRequest;)Landroid/webkit/WebResourceResponse;
    .registers 5

    .prologue
    .line 88
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$1;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-interface {p2}, Landroid/webkit/WebResourceRequest;->getUrl()Landroid/net/Uri;

    move-result-object v1

    invoke-static {v0, v1}, Lcom/careless/springpod/MainActivity;->access$100(Lcom/careless/springpod/MainActivity;Landroid/net/Uri;)Landroid/webkit/WebResourceResponse;

    move-result-object v0

    return-object v0
.end method

###### Class com.careless.springpod.MainActivity.AnonymousClass2 (com.careless.springpod.MainActivity$2)
.class Lcom/careless/springpod/MainActivity$2;
.super Ljava/lang/Object;
.source "MainActivity.java"

# interfaces
.implements Landroid/media/MediaPlayer$OnPreparedListener;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/careless/springpod/MainActivity;->startMusic(Ljava/lang/String;Z)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/careless/springpod/MainActivity;


# direct methods
.method constructor <init>(Lcom/careless/springpod/MainActivity;)V
    .registers 2

    .prologue
    .line 317
    iput-object p1, p0, Lcom/careless/springpod/MainActivity$2;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public onPrepared(Landroid/media/MediaPlayer;)V
    .registers 8

    .prologue
    const-wide v4, 0x408f400000000000L    # 1000.0

    .line 319
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$2;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-static {v0}, Lcom/careless/springpod/MainActivity;->access$1100(Lcom/careless/springpod/MainActivity;)Landroid/media/MediaPlayer;

    move-result-object v0

    if-eq v0, p1, :cond_e

    .line 324
    :goto_d
    return-void

    .line 320
    :cond_e
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$2;->this$0:Lcom/careless/springpod/MainActivity;

    const/4 v1, 0x1

    invoke-static {v0, v1}, Lcom/careless/springpod/MainActivity;->access$1202(Lcom/careless/springpod/MainActivity;Z)Z

    .line 321
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$2;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-virtual {p1}, Landroid/media/MediaPlayer;->getDuration()I

    move-result v1

    int-to-double v2, v1

    div-double/2addr v2, v4

    invoke-static {v0, v2, v3}, Lcom/careless/springpod/MainActivity;->access$1502(Lcom/careless/springpod/MainActivity;D)D

    .line 322
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$2;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-static {v0}, Lcom/careless/springpod/MainActivity;->access$1300(Lcom/careless/springpod/MainActivity;)D

    move-result-wide v0

    const-wide/16 v2, 0x0

    cmpl-double v0, v0, v2

    if-ltz v0, :cond_41

    iget-object v0, p0, Lcom/careless/springpod/MainActivity$2;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-static {v0}, Lcom/careless/springpod/MainActivity;->access$1300(Lcom/careless/springpod/MainActivity;)D

    move-result-wide v0

    mul-double/2addr v0, v4

    invoke-static {v0, v1}, Ljava/lang/Math;->round(D)J

    move-result-wide v0

    long-to-int v0, v0

    invoke-virtual {p1, v0}, Landroid/media/MediaPlayer;->seekTo(I)V

    iget-object v0, p0, Lcom/careless/springpod/MainActivity$2;->this$0:Lcom/careless/springpod/MainActivity;

    const-wide/high16 v2, -0x4010000000000000L    # -1.0

    invoke-static {v0, v2, v3}, Lcom/careless/springpod/MainActivity;->access$1302(Lcom/careless/springpod/MainActivity;D)D

    .line 323
    :cond_41
    invoke-virtual {p1}, Landroid/media/MediaPlayer;->start()V

    goto :goto_d
.end method

###### Class com.careless.springpod.MainActivity.AnonymousClass3 (com.careless.springpod.MainActivity$3)
.class Lcom/careless/springpod/MainActivity$3;
.super Ljava/lang/Object;
.source "MainActivity.java"

# interfaces
.implements Landroid/media/MediaPlayer$OnCompletionListener;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/careless/springpod/MainActivity;->startMusic(Ljava/lang/String;Z)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/careless/springpod/MainActivity;


# direct methods
.method constructor <init>(Lcom/careless/springpod/MainActivity;)V
    .registers 2

    .prologue
    .line 326
    iput-object p1, p0, Lcom/careless/springpod/MainActivity$3;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public onCompletion(Landroid/media/MediaPlayer;)V
    .registers 4

    .prologue
    .line 328
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$3;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-static {v0}, Lcom/careless/springpod/MainActivity;->access$1100(Lcom/careless/springpod/MainActivity;)Landroid/media/MediaPlayer;

    move-result-object v0

    if-eq v0, p1, :cond_9

    .line 330
    :goto_8
    return-void

    .line 329
    :cond_9
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$3;->this$0:Lcom/careless/springpod/MainActivity;

    const-string v1, "window.__spMusicEnd && window.__spMusicEnd()"

    invoke-static {v0, v1}, Lcom/careless/springpod/MainActivity;->access$1600(Lcom/careless/springpod/MainActivity;Ljava/lang/String;)V

    goto :goto_8
.end method

###### Class com.careless.springpod.MainActivity.AnonymousClass4 (com.careless.springpod.MainActivity$4)
.class Lcom/careless/springpod/MainActivity$4;
.super Ljava/lang/Object;
.source "MainActivity.java"

# interfaces
.implements Landroid/media/MediaPlayer$OnErrorListener;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/careless/springpod/MainActivity;->startMusic(Ljava/lang/String;Z)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/careless/springpod/MainActivity;


# direct methods
.method constructor <init>(Lcom/careless/springpod/MainActivity;)V
    .registers 2

    .prologue
    .line 332
    iput-object p1, p0, Lcom/careless/springpod/MainActivity$4;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public onError(Landroid/media/MediaPlayer;II)Z
    .registers 7

    .prologue
    .line 334
    const-string v0, "SpringPod"

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    const-string v2, "MediaPlayer error "

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, p2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v2, "/"

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, p3}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 335
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$4;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-static {v0}, Lcom/careless/springpod/MainActivity;->access$1100(Lcom/careless/springpod/MainActivity;)Landroid/media/MediaPlayer;

    move-result-object v0

    if-ne v0, p1, :cond_2f

    iget-object v0, p0, Lcom/careless/springpod/MainActivity$4;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-static {v0}, Lcom/careless/springpod/MainActivity;->access$1000(Lcom/careless/springpod/MainActivity;)V

    .line 336
    :cond_2f
    const/4 v0, 0x1

    return v0
.end method

###### Class com.careless.springpod.MainActivity.AnonymousClass5 (com.careless.springpod.MainActivity$5)
.class Lcom/careless/springpod/MainActivity$5;
.super Ljava/lang/Object;
.source "MainActivity.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/careless/springpod/MainActivity;->onActivityResult(IILandroid/content/Intent;)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/careless/springpod/MainActivity;

.field final synthetic val$id:I

.field final synthetic val$to:Ljava/lang/String;

.field final synthetic val$uris:Ljava/util/List;


# direct methods
.method constructor <init>(Lcom/careless/springpod/MainActivity;Ljava/util/List;Ljava/lang/String;I)V
    .registers 5
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "()V"
        }
    .end annotation

    .prologue
    .line 360
    iput-object p1, p0, Lcom/careless/springpod/MainActivity$5;->this$0:Lcom/careless/springpod/MainActivity;

    iput-object p2, p0, Lcom/careless/springpod/MainActivity$5;->val$uris:Ljava/util/List;

    iput-object p3, p0, Lcom/careless/springpod/MainActivity$5;->val$to:Ljava/lang/String;

    iput p4, p0, Lcom/careless/springpod/MainActivity$5;->val$id:I

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .registers 9

    .prologue
    const/4 v2, 0x0

    .line 361
    new-instance v3, Lorg/json/JSONArray;

    invoke-direct {v3}, Lorg/json/JSONArray;-><init>()V

    .line 363
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$5;->val$uris:Ljava/util/List;

    invoke-interface {v0}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object v4

    move-object v1, v2

    :goto_d
    invoke-interface {v4}, Ljava/util/Iterator;->hasNext()Z

    move-result v0

    if-eqz v0, :cond_5a

    invoke-interface {v4}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Landroid/net/Uri;

    .line 364
    :try_start_19
    iget-object v5, p0, Lcom/careless/springpod/MainActivity$5;->this$0:Lcom/careless/springpod/MainActivity;

    iget-object v6, p0, Lcom/careless/springpod/MainActivity$5;->val$to:Ljava/lang/String;

    invoke-static {v5, v0, v6}, Lcom/careless/springpod/MainActivity;->access$1700(Lcom/careless/springpod/MainActivity;Landroid/net/Uri;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    if-eqz v5, :cond_26

    invoke-virtual {v3, v5}, Lorg/json/JSONArray;->put(Ljava/lang/Object;)Lorg/json/JSONArray;
    :try_end_26
    .catch Ljava/lang/Throwable; {:try_start_19 .. :try_end_26} :catch_29

    :cond_26
    move-object v0, v1

    :goto_27
    move-object v1, v0

    .line 366
    goto :goto_d

    .line 365
    :catch_29
    move-exception v1

    const-string v5, "SpringPod"

    new-instance v6, Ljava/lang/StringBuilder;

    invoke-direct {v6}, Ljava/lang/StringBuilder;-><init>()V

    const-string v7, "import "

    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v6

    invoke-virtual {v6, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-static {v5, v0, v1}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    const-string v5, "Could not import a file: "

    invoke-virtual {v0, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v1}, Ljava/lang/Throwable;->getMessage()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    goto :goto_27

    .line 367
    :cond_5a
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$5;->this$0:Lcom/careless/springpod/MainActivity;

    iget v4, p0, Lcom/careless/springpod/MainActivity$5;->val$id:I

    invoke-virtual {v3}, Lorg/json/JSONArray;->toString()Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v3}, Lorg/json/JSONArray;->length()I

    move-result v3

    if-nez v3, :cond_6c

    :goto_68
    invoke-static {v0, v4, v5, v1}, Lcom/careless/springpod/MainActivity;->access$700(Lcom/careless/springpod/MainActivity;ILjava/lang/String;Ljava/lang/String;)V

    .line 368
    return-void

    :cond_6c
    move-object v1, v2

    .line 367
    goto :goto_68
.end method

###### Class com.careless.springpod.MainActivity.AnonymousClass6 (com.careless.springpod.MainActivity$6)
.class Lcom/careless/springpod/MainActivity$6;
.super Ljava/lang/Object;
.source "MainActivity.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/careless/springpod/MainActivity;->js(Ljava/lang/String;)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/careless/springpod/MainActivity;

.field final synthetic val$code:Ljava/lang/String;


# direct methods
.method constructor <init>(Lcom/careless/springpod/MainActivity;Ljava/lang/String;)V
    .registers 3
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "()V"
        }
    .end annotation

    .prologue
    .line 408
    iput-object p1, p0, Lcom/careless/springpod/MainActivity$6;->this$0:Lcom/careless/springpod/MainActivity;

    iput-object p2, p0, Lcom/careless/springpod/MainActivity$6;->val$code:Ljava/lang/String;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .registers 4

    .prologue
    .line 409
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$6;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-static {v0}, Lcom/careless/springpod/MainActivity;->access$1800(Lcom/careless/springpod/MainActivity;)Landroid/webkit/WebView;

    move-result-object v0

    if-eqz v0, :cond_14

    iget-object v0, p0, Lcom/careless/springpod/MainActivity$6;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-static {v0}, Lcom/careless/springpod/MainActivity;->access$1800(Lcom/careless/springpod/MainActivity;)Landroid/webkit/WebView;

    move-result-object v0

    iget-object v1, p0, Lcom/careless/springpod/MainActivity$6;->val$code:Ljava/lang/String;

    const/4 v2, 0x0

    invoke-virtual {v0, v1, v2}, Landroid/webkit/WebView;->evaluateJavascript(Ljava/lang/String;Landroid/webkit/ValueCallback;)V

    .line 410
    :cond_14
    return-void
.end method

###### Class com.careless.springpod.MainActivity.Bridge (com.careless.springpod.MainActivity$Bridge)
.class Lcom/careless/springpod/MainActivity$Bridge;
.super Ljava/lang/Object;
.source "MainActivity.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lcom/careless/springpod/MainActivity;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x2
    name = "Bridge"
.end annotation


# instance fields
.field final synthetic this$0:Lcom/careless/springpod/MainActivity;


# direct methods
.method private constructor <init>(Lcom/careless/springpod/MainActivity;)V
    .registers 2

    .prologue
    .line 192
    iput-object p1, p0, Lcom/careless/springpod/MainActivity$Bridge;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method synthetic constructor <init>(Lcom/careless/springpod/MainActivity;Lcom/careless/springpod/MainActivity$1;)V
    .registers 3

    .prologue
    .line 192
    invoke-direct {p0, p1}, Lcom/careless/springpod/MainActivity$Bridge;-><init>(Lcom/careless/springpod/MainActivity;)V

    return-void
.end method


# virtual methods
.method public fsAppendBase64(Ljava/lang/String;Ljava/lang/String;)Z
    .registers 9
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .prologue
    const/4 v1, 0x1

    const/4 v0, 0x0

    .line 219
    iget-object v2, p0, Lcom/careless/springpod/MainActivity$Bridge;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-static {v2, p1}, Lcom/careless/springpod/MainActivity;->access$200(Lcom/careless/springpod/MainActivity;Ljava/lang/String;)Ljava/io/File;

    move-result-object v2

    .line 220
    if-nez v2, :cond_b

    .line 227
    :goto_a
    return v0

    .line 222
    :cond_b
    :try_start_b
    invoke-virtual {v2}, Ljava/io/File;->getParentFile()Ljava/io/File;

    move-result-object v3

    if-eqz v3, :cond_14

    invoke-virtual {v3}, Ljava/io/File;->mkdirs()Z

    .line 223
    :cond_14
    const/4 v3, 0x0

    invoke-static {p2, v3}, Landroid/util/Base64;->decode(Ljava/lang/String;I)[B

    move-result-object v3

    .line 224
    new-instance v4, Ljava/io/FileOutputStream;

    const/4 v5, 0x1

    invoke-direct {v4, v2, v5}, Ljava/io/FileOutputStream;-><init>(Ljava/io/File;Z)V
    :try_end_1f
    .catch Ljava/lang/Throwable; {:try_start_b .. :try_end_1f} :catch_2c

    .line 225
    :try_start_1f
    invoke-virtual {v4, v3}, Ljava/io/FileOutputStream;->write([B)V
    :try_end_22
    .catchall {:try_start_1f .. :try_end_22} :catchall_27

    :try_start_22
    invoke-virtual {v4}, Ljava/io/FileOutputStream;->close()V

    move v0, v1

    .line 226
    goto :goto_a

    .line 225
    :catchall_27
    move-exception v1

    invoke-virtual {v4}, Ljava/io/FileOutputStream;->close()V

    throw v1
    :try_end_2c
    .catch Ljava/lang/Throwable; {:try_start_22 .. :try_end_2c} :catch_2c

    .line 227
    :catch_2c
    move-exception v1

    const-string v2, "SpringPod"

    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3}, Ljava/lang/StringBuilder;-><init>()V

    const-string v4, "append "

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2, v3, v1}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    goto :goto_a
.end method

.method public fsExists(Ljava/lang/String;)Z
    .registers 3
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .prologue
    .line 195
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$Bridge;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-static {v0, p1}, Lcom/careless/springpod/MainActivity;->access$200(Lcom/careless/springpod/MainActivity;Ljava/lang/String;)Ljava/io/File;

    move-result-object v0

    if-eqz v0, :cond_10

    invoke-virtual {v0}, Ljava/io/File;->exists()Z

    move-result v0

    if-eqz v0, :cond_10

    const/4 v0, 0x1

    :goto_f
    return v0

    :cond_10
    const/4 v0, 0x0

    goto :goto_f
.end method

.method public fsImport(Ljava/lang/String;I)V
    .registers 5
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .prologue
    .line 230
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$Bridge;->this$0:Lcom/careless/springpod/MainActivity;

    new-instance v1, Lcom/careless/springpod/MainActivity$Bridge$1;

    invoke-direct {v1, p0, p1, p2}, Lcom/careless/springpod/MainActivity$Bridge$1;-><init>(Lcom/careless/springpod/MainActivity$Bridge;Ljava/lang/String;I)V

    invoke-virtual {v0, v1}, Lcom/careless/springpod/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 244
    return-void
.end method

.method public fsMkdir(Ljava/lang/String;)V
    .registers 3
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .prologue
    .line 198
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$Bridge;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-static {v0, p1}, Lcom/careless/springpod/MainActivity;->access$200(Lcom/careless/springpod/MainActivity;Ljava/lang/String;)Ljava/io/File;

    move-result-object v0

    if-eqz v0, :cond_b

    invoke-virtual {v0}, Ljava/io/File;->mkdirs()Z

    .line 199
    :cond_b
    return-void
.end method

.method public fsReadBase64(Ljava/lang/String;)Ljava/lang/String;
    .registers 8
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .prologue
    .line 205
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$Bridge;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-static {v0, p1}, Lcom/careless/springpod/MainActivity;->access$200(Lcom/careless/springpod/MainActivity;Ljava/lang/String;)Ljava/io/File;

    move-result-object v0

    .line 206
    if-eqz v0, :cond_e

    invoke-virtual {v0}, Ljava/io/File;->isFile()Z

    move-result v1

    if-nez v1, :cond_11

    :cond_e
    const-string v0, ""

    .line 216
    :goto_10
    return-object v0

    .line 208
    :cond_11
    :try_start_11
    invoke-virtual {v0}, Ljava/io/File;->length()J

    move-result-wide v2

    const-wide/32 v4, 0x3000000

    invoke-static {v2, v3, v4, v5}, Ljava/lang/Math;->min(JJ)J

    move-result-wide v2

    .line 209
    long-to-int v1, v2

    new-array v1, v1, [B

    .line 210
    new-instance v2, Ljava/io/FileInputStream;

    invoke-direct {v2, v0}, Ljava/io/FileInputStream;-><init>(Ljava/io/File;)V
    :try_end_24
    .catch Ljava/lang/Throwable; {:try_start_11 .. :try_end_24} :catch_40

    .line 212
    const/4 v0, 0x0

    .line 213
    :goto_25
    :try_start_25
    array-length v3, v1

    if-ge v0, v3, :cond_30

    array-length v3, v1

    sub-int/2addr v3, v0

    invoke-virtual {v2, v1, v0, v3}, Ljava/io/FileInputStream;->read([BII)I
    :try_end_2d
    .catchall {:try_start_25 .. :try_end_2d} :catchall_3b

    move-result v3

    if-gez v3, :cond_39

    .line 214
    :cond_30
    :try_start_30
    invoke-virtual {v2}, Ljava/io/FileInputStream;->close()V

    .line 215
    const/4 v0, 0x2

    invoke-static {v1, v0}, Landroid/util/Base64;->encodeToString([BI)Ljava/lang/String;

    move-result-object v0

    goto :goto_10

    .line 213
    :cond_39
    add-int/2addr v0, v3

    goto :goto_25

    .line 214
    :catchall_3b
    move-exception v0

    invoke-virtual {v2}, Ljava/io/FileInputStream;->close()V

    throw v0
    :try_end_40
    .catch Ljava/lang/Throwable; {:try_start_30 .. :try_end_40} :catch_40

    .line 216
    :catch_40
    move-exception v0

    const-string v1, "SpringPod"

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    const-string v3, "read "

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2, v0}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    const-string v0, ""

    goto :goto_10
.end method

.method public fsRemove(Ljava/lang/String;)V
    .registers 4
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .prologue
    .line 201
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$Bridge;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-static {v0, p1}, Lcom/careless/springpod/MainActivity;->access$200(Lcom/careless/springpod/MainActivity;Ljava/lang/String;)Ljava/io/File;

    move-result-object v0

    .line 202
    if-eqz v0, :cond_17

    iget-object v1, p0, Lcom/careless/springpod/MainActivity$Bridge;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-static {v1}, Lcom/careless/springpod/MainActivity;->access$300(Lcom/careless/springpod/MainActivity;)Ljava/io/File;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/io/File;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_17

    invoke-static {v0}, Lcom/careless/springpod/MainActivity;->access$400(Ljava/io/File;)V

    .line 203
    :cond_17
    return-void
.end method

.method public musicDuration()D
    .registers 3
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .prologue
    .line 271
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$Bridge;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-static {v0}, Lcom/careless/springpod/MainActivity;->access$1500(Lcom/careless/springpod/MainActivity;)D

    move-result-wide v0

    return-wide v0
.end method

.method public musicPlay(Ljava/lang/String;Z)Ljava/lang/String;
    .registers 5
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .prologue
    .line 248
    const-string v0, "files/"

    invoke-virtual {p1, v0}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_2f

    .line 249
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$Bridge;->this$0:Lcom/careless/springpod/MainActivity;

    const/4 v1, 0x6

    invoke-virtual {p1, v1}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Lcom/careless/springpod/MainActivity;->access$200(Lcom/careless/springpod/MainActivity;Ljava/lang/String;)Ljava/io/File;

    move-result-object v0

    .line 250
    if-eqz v0, :cond_1b

    invoke-virtual {v0}, Ljava/io/File;->isFile()Z

    move-result v0

    if-nez v0, :cond_2f

    :cond_1b
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    const-string v1, "file not found: "

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    .line 253
    :goto_2e
    return-object v0

    .line 252
    :cond_2f
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$Bridge;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-static {v0}, Lcom/careless/springpod/MainActivity;->access$900(Lcom/careless/springpod/MainActivity;)Landroid/os/Handler;

    move-result-object v0

    new-instance v1, Lcom/careless/springpod/MainActivity$Bridge$2;

    invoke-direct {v1, p0, p1, p2}, Lcom/careless/springpod/MainActivity$Bridge$2;-><init>(Lcom/careless/springpod/MainActivity$Bridge;Ljava/lang/String;Z)V

    invoke-virtual {v0, v1}, Landroid/os/Handler;->post(Ljava/lang/Runnable;)Z

    .line 253
    const-string v0, ""

    goto :goto_2e
.end method

.method public musicSeek(D)V
    .registers 6
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .prologue
    .line 259
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$Bridge;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-static {v0}, Lcom/careless/springpod/MainActivity;->access$900(Lcom/careless/springpod/MainActivity;)Landroid/os/Handler;

    move-result-object v0

    new-instance v1, Lcom/careless/springpod/MainActivity$Bridge$4;

    invoke-direct {v1, p0, p1, p2}, Lcom/careless/springpod/MainActivity$Bridge$4;-><init>(Lcom/careless/springpod/MainActivity$Bridge;D)V

    invoke-virtual {v0, v1}, Landroid/os/Handler;->post(Ljava/lang/Runnable;)Z

    .line 264
    return-void
.end method

.method public musicStop()V
    .registers 3
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .prologue
    .line 256
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$Bridge;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-static {v0}, Lcom/careless/springpod/MainActivity;->access$900(Lcom/careless/springpod/MainActivity;)Landroid/os/Handler;

    move-result-object v0

    new-instance v1, Lcom/careless/springpod/MainActivity$Bridge$3;

    invoke-direct {v1, p0}, Lcom/careless/springpod/MainActivity$Bridge$3;-><init>(Lcom/careless/springpod/MainActivity$Bridge;)V

    invoke-virtual {v0, v1}, Landroid/os/Handler;->post(Ljava/lang/Runnable;)Z

    .line 257
    return-void
.end method

.method public musicVolume(D)V
    .registers 6
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .prologue
    .line 266
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$Bridge;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-static {v0}, Lcom/careless/springpod/MainActivity;->access$900(Lcom/careless/springpod/MainActivity;)Landroid/os/Handler;

    move-result-object v0

    new-instance v1, Lcom/careless/springpod/MainActivity$Bridge$5;

    invoke-direct {v1, p0, p1, p2}, Lcom/careless/springpod/MainActivity$Bridge$5;-><init>(Lcom/careless/springpod/MainActivity$Bridge;D)V

    invoke-virtual {v0, v1}, Landroid/os/Handler;->post(Ljava/lang/Runnable;)Z

    .line 270
    return-void
.end method

###### Class com.careless.springpod.MainActivity.Bridge.AnonymousClass1 (com.careless.springpod.MainActivity$Bridge$1)
.class Lcom/careless/springpod/MainActivity$Bridge$1;
.super Ljava/lang/Object;
.source "MainActivity.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/careless/springpod/MainActivity$Bridge;->fsImport(Ljava/lang/String;I)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$1:Lcom/careless/springpod/MainActivity$Bridge;

.field final synthetic val$id:I

.field final synthetic val$optsJson:Ljava/lang/String;


# direct methods
.method constructor <init>(Lcom/careless/springpod/MainActivity$Bridge;Ljava/lang/String;I)V
    .registers 4
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "()V"
        }
    .end annotation

    .prologue
    .line 230
    iput-object p1, p0, Lcom/careless/springpod/MainActivity$Bridge$1;->this$1:Lcom/careless/springpod/MainActivity$Bridge;

    iput-object p2, p0, Lcom/careless/springpod/MainActivity$Bridge$1;->val$optsJson:Ljava/lang/String;

    iput p3, p0, Lcom/careless/springpod/MainActivity$Bridge$1;->val$id:I

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .registers 7

    .prologue
    .line 232
    :try_start_0
    new-instance v0, Lorg/json/JSONObject;

    iget-object v1, p0, Lcom/careless/springpod/MainActivity$Bridge$1;->val$optsJson:Ljava/lang/String;

    invoke-direct {v0, v1}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    .line 233
    iget-object v1, p0, Lcom/careless/springpod/MainActivity$Bridge$1;->this$1:Lcom/careless/springpod/MainActivity$Bridge;

    iget-object v1, v1, Lcom/careless/springpod/MainActivity$Bridge;->this$0:Lcom/careless/springpod/MainActivity;

    iget v2, p0, Lcom/careless/springpod/MainActivity$Bridge$1;->val$id:I

    invoke-static {v1, v2}, Lcom/careless/springpod/MainActivity;->access$502(Lcom/careless/springpod/MainActivity;I)I

    .line 234
    iget-object v1, p0, Lcom/careless/springpod/MainActivity$Bridge$1;->this$1:Lcom/careless/springpod/MainActivity$Bridge;

    iget-object v1, v1, Lcom/careless/springpod/MainActivity$Bridge;->this$0:Lcom/careless/springpod/MainActivity;

    const-string v2, "to"

    const-string v3, ""

    invoke-virtual {v0, v2, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Lcom/careless/springpod/MainActivity;->access$602(Lcom/careless/springpod/MainActivity;Ljava/lang/String;)Ljava/lang/String;

    .line 235
    new-instance v1, Landroid/content/Intent;

    const-string v2, "android.intent.action.OPEN_DOCUMENT"

    invoke-direct {v1, v2}, Landroid/content/Intent;-><init>(Ljava/lang/String;)V

    .line 236
    const-string v2, "android.intent.category.OPENABLE"

    invoke-virtual {v1, v2}, Landroid/content/Intent;->addCategory(Ljava/lang/String;)Landroid/content/Intent;

    .line 237
    const-string v2, "audio/*"

    invoke-virtual {v1, v2}, Landroid/content/Intent;->setType(Ljava/lang/String;)Landroid/content/Intent;

    .line 238
    const-string v2, "android.intent.extra.ALLOW_MULTIPLE"

    const-string v3, "multiple"

    const/4 v4, 0x0

    invoke-virtual {v0, v3, v4}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;Z)Z

    move-result v0

    invoke-virtual {v1, v2, v0}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Z)Landroid/content/Intent;

    .line 239
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$Bridge$1;->this$1:Lcom/careless/springpod/MainActivity$Bridge;

    iget-object v0, v0, Lcom/careless/springpod/MainActivity$Bridge;->this$0:Lcom/careless/springpod/MainActivity;

    const/16 v2, 0x1069

    invoke-virtual {v0, v1, v2}, Lcom/careless/springpod/MainActivity;->startActivityForResult(Landroid/content/Intent;I)V
    :try_end_45
    .catch Ljava/lang/Throwable; {:try_start_0 .. :try_end_45} :catch_46

    .line 243
    :goto_45
    return-void

    .line 240
    :catch_46
    move-exception v0

    .line 241
    iget-object v1, p0, Lcom/careless/springpod/MainActivity$Bridge$1;->this$1:Lcom/careless/springpod/MainActivity$Bridge;

    iget-object v1, v1, Lcom/careless/springpod/MainActivity$Bridge;->this$0:Lcom/careless/springpod/MainActivity;

    iget v2, p0, Lcom/careless/springpod/MainActivity$Bridge$1;->val$id:I

    const-string v3, "[]"

    new-instance v4, Ljava/lang/StringBuilder;

    invoke-direct {v4}, Ljava/lang/StringBuilder;-><init>()V

    const-string v5, "Could not open the file picker: "

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v0}, Ljava/lang/Throwable;->getMessage()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v4, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-static {v1, v2, v3, v0}, Lcom/careless/springpod/MainActivity;->access$700(Lcom/careless/springpod/MainActivity;ILjava/lang/String;Ljava/lang/String;)V

    goto :goto_45
.end method

###### Class com.careless.springpod.MainActivity.Bridge.AnonymousClass2 (com.careless.springpod.MainActivity$Bridge$2)
.class Lcom/careless/springpod/MainActivity$Bridge$2;
.super Ljava/lang/Object;
.source "MainActivity.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/careless/springpod/MainActivity$Bridge;->musicPlay(Ljava/lang/String;Z)Ljava/lang/String;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$1:Lcom/careless/springpod/MainActivity$Bridge;

.field final synthetic val$loop:Z

.field final synthetic val$path:Ljava/lang/String;


# direct methods
.method constructor <init>(Lcom/careless/springpod/MainActivity$Bridge;Ljava/lang/String;Z)V
    .registers 4
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "()V"
        }
    .end annotation

    .prologue
    .line 252
    iput-object p1, p0, Lcom/careless/springpod/MainActivity$Bridge$2;->this$1:Lcom/careless/springpod/MainActivity$Bridge;

    iput-object p2, p0, Lcom/careless/springpod/MainActivity$Bridge$2;->val$path:Ljava/lang/String;

    iput-boolean p3, p0, Lcom/careless/springpod/MainActivity$Bridge$2;->val$loop:Z

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .registers 4

    .prologue
    .line 252
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$Bridge$2;->this$1:Lcom/careless/springpod/MainActivity$Bridge;

    iget-object v0, v0, Lcom/careless/springpod/MainActivity$Bridge;->this$0:Lcom/careless/springpod/MainActivity;

    iget-object v1, p0, Lcom/careless/springpod/MainActivity$Bridge$2;->val$path:Ljava/lang/String;

    iget-boolean v2, p0, Lcom/careless/springpod/MainActivity$Bridge$2;->val$loop:Z

    invoke-static {v0, v1, v2}, Lcom/careless/springpod/MainActivity;->access$800(Lcom/careless/springpod/MainActivity;Ljava/lang/String;Z)V

    return-void
.end method

###### Class com.careless.springpod.MainActivity.Bridge.AnonymousClass3 (com.careless.springpod.MainActivity$Bridge$3)
.class Lcom/careless/springpod/MainActivity$Bridge$3;
.super Ljava/lang/Object;
.source "MainActivity.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/careless/springpod/MainActivity$Bridge;->musicStop()V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$1:Lcom/careless/springpod/MainActivity$Bridge;


# direct methods
.method constructor <init>(Lcom/careless/springpod/MainActivity$Bridge;)V
    .registers 2

    .prologue
    .line 256
    iput-object p1, p0, Lcom/careless/springpod/MainActivity$Bridge$3;->this$1:Lcom/careless/springpod/MainActivity$Bridge;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .registers 2

    .prologue
    .line 256
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$Bridge$3;->this$1:Lcom/careless/springpod/MainActivity$Bridge;

    iget-object v0, v0, Lcom/careless/springpod/MainActivity$Bridge;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-static {v0}, Lcom/careless/springpod/MainActivity;->access$1000(Lcom/careless/springpod/MainActivity;)V

    return-void
.end method

###### Class com.careless.springpod.MainActivity.Bridge.AnonymousClass4 (com.careless.springpod.MainActivity$Bridge$4)
.class Lcom/careless/springpod/MainActivity$Bridge$4;
.super Ljava/lang/Object;
.source "MainActivity.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/careless/springpod/MainActivity$Bridge;->musicSeek(D)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$1:Lcom/careless/springpod/MainActivity$Bridge;

.field final synthetic val$sec:D


# direct methods
.method constructor <init>(Lcom/careless/springpod/MainActivity$Bridge;D)V
    .registers 4
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "()V"
        }
    .end annotation

    .prologue
    .line 259
    iput-object p1, p0, Lcom/careless/springpod/MainActivity$Bridge$4;->this$1:Lcom/careless/springpod/MainActivity$Bridge;

    iput-wide p2, p0, Lcom/careless/springpod/MainActivity$Bridge$4;->val$sec:D

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .registers 7

    .prologue
    .line 260
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$Bridge$4;->this$1:Lcom/careless/springpod/MainActivity$Bridge;

    iget-object v0, v0, Lcom/careless/springpod/MainActivity$Bridge;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-static {v0}, Lcom/careless/springpod/MainActivity;->access$1100(Lcom/careless/springpod/MainActivity;)Landroid/media/MediaPlayer;

    move-result-object v0

    if-nez v0, :cond_b

    .line 263
    :goto_a
    return-void

    .line 261
    :cond_b
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$Bridge$4;->this$1:Lcom/careless/springpod/MainActivity$Bridge;

    iget-object v0, v0, Lcom/careless/springpod/MainActivity$Bridge;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-static {v0}, Lcom/careless/springpod/MainActivity;->access$1200(Lcom/careless/springpod/MainActivity;)Z

    move-result v0

    if-eqz v0, :cond_37

    :try_start_15
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$Bridge$4;->this$1:Lcom/careless/springpod/MainActivity$Bridge;

    iget-object v0, v0, Lcom/careless/springpod/MainActivity$Bridge;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-static {v0}, Lcom/careless/springpod/MainActivity;->access$1100(Lcom/careless/springpod/MainActivity;)Landroid/media/MediaPlayer;

    move-result-object v0

    iget-wide v2, p0, Lcom/careless/springpod/MainActivity$Bridge$4;->val$sec:D

    const-wide v4, 0x408f400000000000L    # 1000.0

    mul-double/2addr v2, v4

    invoke-static {v2, v3}, Ljava/lang/Math;->round(D)J

    move-result-wide v2

    long-to-int v1, v2

    invoke-virtual {v0, v1}, Landroid/media/MediaPlayer;->seekTo(I)V
    :try_end_2d
    .catch Ljava/lang/Throwable; {:try_start_15 .. :try_end_2d} :catch_2e

    goto :goto_a

    :catch_2e
    move-exception v0

    const-string v1, "SpringPod"

    const-string v2, "seek"

    invoke-static {v1, v2, v0}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    goto :goto_a

    .line 262
    :cond_37
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$Bridge$4;->this$1:Lcom/careless/springpod/MainActivity$Bridge;

    iget-object v0, v0, Lcom/careless/springpod/MainActivity$Bridge;->this$0:Lcom/careless/springpod/MainActivity;

    iget-wide v2, p0, Lcom/careless/springpod/MainActivity$Bridge$4;->val$sec:D

    invoke-static {v0, v2, v3}, Lcom/careless/springpod/MainActivity;->access$1302(Lcom/careless/springpod/MainActivity;D)D

    goto :goto_a
.end method

###### Class com.careless.springpod.MainActivity.Bridge.AnonymousClass5 (com.careless.springpod.MainActivity$Bridge$5)
.class Lcom/careless/springpod/MainActivity$Bridge$5;
.super Ljava/lang/Object;
.source "MainActivity.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/careless/springpod/MainActivity$Bridge;->musicVolume(D)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$1:Lcom/careless/springpod/MainActivity$Bridge;

.field final synthetic val$v:D


# direct methods
.method constructor <init>(Lcom/careless/springpod/MainActivity$Bridge;D)V
    .registers 4
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "()V"
        }
    .end annotation

    .prologue
    .line 266
    iput-object p1, p0, Lcom/careless/springpod/MainActivity$Bridge$5;->this$1:Lcom/careless/springpod/MainActivity$Bridge;

    iput-wide p2, p0, Lcom/careless/springpod/MainActivity$Bridge$5;->val$v:D

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .registers 9

    .prologue
    .line 267
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$Bridge$5;->this$1:Lcom/careless/springpod/MainActivity$Bridge;

    iget-object v0, v0, Lcom/careless/springpod/MainActivity$Bridge;->this$0:Lcom/careless/springpod/MainActivity;

    const-wide/16 v2, 0x0

    const-wide/high16 v4, 0x3ff0000000000000L    # 1.0

    iget-wide v6, p0, Lcom/careless/springpod/MainActivity$Bridge$5;->val$v:D

    invoke-static {v4, v5, v6, v7}, Ljava/lang/Math;->min(DD)D

    move-result-wide v4

    invoke-static {v2, v3, v4, v5}, Ljava/lang/Math;->max(DD)D

    move-result-wide v2

    double-to-float v1, v2

    invoke-static {v0, v1}, Lcom/careless/springpod/MainActivity;->access$1402(Lcom/careless/springpod/MainActivity;F)F

    .line 268
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$Bridge$5;->this$1:Lcom/careless/springpod/MainActivity$Bridge;

    iget-object v0, v0, Lcom/careless/springpod/MainActivity$Bridge;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-static {v0}, Lcom/careless/springpod/MainActivity;->access$1100(Lcom/careless/springpod/MainActivity;)Landroid/media/MediaPlayer;

    move-result-object v0

    if-eqz v0, :cond_3b

    :try_start_20
    iget-object v0, p0, Lcom/careless/springpod/MainActivity$Bridge$5;->this$1:Lcom/careless/springpod/MainActivity$Bridge;

    iget-object v0, v0, Lcom/careless/springpod/MainActivity$Bridge;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-static {v0}, Lcom/careless/springpod/MainActivity;->access$1100(Lcom/careless/springpod/MainActivity;)Landroid/media/MediaPlayer;

    move-result-object v0

    iget-object v1, p0, Lcom/careless/springpod/MainActivity$Bridge$5;->this$1:Lcom/careless/springpod/MainActivity$Bridge;

    iget-object v1, v1, Lcom/careless/springpod/MainActivity$Bridge;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-static {v1}, Lcom/careless/springpod/MainActivity;->access$1400(Lcom/careless/springpod/MainActivity;)F

    move-result v1

    iget-object v2, p0, Lcom/careless/springpod/MainActivity$Bridge$5;->this$1:Lcom/careless/springpod/MainActivity$Bridge;

    iget-object v2, v2, Lcom/careless/springpod/MainActivity$Bridge;->this$0:Lcom/careless/springpod/MainActivity;

    invoke-static {v2}, Lcom/careless/springpod/MainActivity;->access$1400(Lcom/careless/springpod/MainActivity;)F

    move-result v2

    invoke-virtual {v0, v1, v2}, Landroid/media/MediaPlayer;->setVolume(FF)V
    :try_end_3b
    .catch Ljava/lang/Throwable; {:try_start_20 .. :try_end_3b} :catch_3c

    .line 269
    :cond_3b
    :goto_3b
    return-void

    .line 268
    :catch_3c
    move-exception v0

    goto :goto_3b
.end method
