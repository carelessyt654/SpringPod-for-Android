package com.careless.springpod;

import android.app.Activity;
import android.content.ClipData;
import android.content.Intent;
import android.content.res.AssetFileDescriptor;
import android.database.Cursor;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Base64;
import android.util.Log;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import org.json.JSONArray;
import org.json.JSONObject;


public class MainActivity extends Activity {
    private static final String HOST = "appassets.local";
    private static final long MAX_READ = 50331648;
    private static final int REQ_IMPORT = 4201;
    private static final String TAG = "SpringPod";
    private MediaPlayer mp;
    private File root;
    private WebView web;
    private final Handler ui = new Handler(Looper.getMainLooper());
    private boolean prepared = false;
    private double pendingSeek = -1.0d;
    private float vol = 0.7f;
    private volatile double durCache = 0.0d;
    private int impId = 0;
    private String impTo = "";

    @Override 
    protected void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        this.root = getFilesDir();
        getWindow().setStatusBarColor(-16777216);
        getWindow().setNavigationBarColor(-16777216);
        hideBars();
        this.web = new WebView(this);
        this.web.setBackgroundColor(-16777216);
        this.web.setOverScrollMode(2);
        this.web.setVerticalScrollBarEnabled(false);
        this.web.setHorizontalScrollBarEnabled(false);
        WebSettings settings = this.web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setSupportZoom(false);
        settings.setCacheMode(-1);
        this.web.addJavascriptInterface(new Bridge(), "Native");
        this.web.setWebViewClient(new WebViewClient() { 
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView webView, WebResourceRequest webResourceRequest) {
                return MainActivity.this.serve(webResourceRequest.getUrl());
            }
        });
        setContentView(this.web, new ViewGroup.LayoutParams(-1, -1));
        this.web.loadUrl("https://appassets.local/index.html");
    }

    @Override 
    protected void onSaveInstanceState(Bundle bundle) {
        super.onSaveInstanceState(bundle);
    }

    private void hideBars() {
        getWindow().getDecorView().setSystemUiVisibility(4102);
    }

    @Override 
    public void onWindowFocusChanged(boolean z) {
        super.onWindowFocusChanged(z);
        if (z) {
            hideBars();
        }
    }

    @Override 
    public void onBackPressed() {
        moveTaskToBack(true);
    }

    @Override 
    protected void onDestroy() {
        releasePlayer();
        if (this.web != null) {
            this.web.destroy();
            this.web = null;
        }
        super.onDestroy();
    }

    
    public WebResourceResponse serve(Uri uri) {
        InputStream inputStreamOpen;
        if (!HOST.equals(uri.getHost())) {
            return null;
        }
        String path = uri.getPath();
        String str = (path == null || path.equals("/") || path.length() == 0) ? "/index.html" : path;
        if (str.contains("..")) {
            return notFound();
        }
        try {
            if (str.startsWith("/files/")) {
                File fileSafe = safe(str.substring(7));
                if (fileSafe == null || !fileSafe.isFile()) {
                    return notFound();
                }
                inputStreamOpen = new FileInputStream(fileSafe);
            } else if (str.equals("/index.html") || str.equals("/runtime.js") || str.equals("/bundle.js")) {
                inputStreamOpen = getAssets().open("www" + str);
            } else if (str.startsWith("/assets/")) {
                inputStreamOpen = getAssets().open("app" + str);
            } else {
                return notFound();
            }
            HashMap map = new HashMap();
            map.put("Cache-Control", str.startsWith("/files/") ? "no-cache" : "max-age=3600");
            return new WebResourceResponse(mime(str), "utf-8", 200, "OK", map, inputStreamOpen);
        } catch (IOException e) {
            return notFound();
        }
    }

    private WebResourceResponse notFound() {
        return new WebResourceResponse("text/plain", "utf-8", 404, "Not Found", new HashMap(), new ByteArrayInputStream(new byte[0]));
    }

    private static String mime(String str) {
        String lowerCase = str.toLowerCase();
        return lowerCase.endsWith(".html") ? "text/html" : lowerCase.endsWith(".js") ? "application/javascript" : lowerCase.endsWith(".png") ? "image/png" : (lowerCase.endsWith(".jpg") || lowerCase.endsWith(".jpeg")) ? "image/jpeg" : lowerCase.endsWith(".gif") ? "image/gif" : lowerCase.endsWith(".webp") ? "image/webp" : lowerCase.endsWith(".bmp") ? "image/bmp" : lowerCase.endsWith(".mp3") ? "audio/mpeg" : "application/octet-stream";
    }

    
    public File safe(String str) {
        if (str == null) {
            return null;
        }
        try {
            File canonicalFile = new File(this.root, str).getCanonicalFile();
            String canonicalPath = this.root.getCanonicalPath();
            if (!canonicalFile.getPath().equals(canonicalPath)) {
                if (!canonicalFile.getPath().startsWith(canonicalPath + File.separator)) {
                    return null;
                }
            }
            return canonicalFile;
        } catch (IOException e) {
            return null;
        }
    }

    
    public static void deleteRec(File file) {
        File[] fileArrListFiles;
        if (file.isDirectory() && (fileArrListFiles = file.listFiles()) != null) {
            for (File file2 : fileArrListFiles) {
                deleteRec(file2);
            }
        }
        file.delete();
    }

    private class Bridge {
        private Bridge() {
        }

        @JavascriptInterface
        public boolean fsExists(String str) {
            File fileSafe = MainActivity.this.safe(str);
            return fileSafe != null && fileSafe.exists();
        }

        @JavascriptInterface
        public void fsMkdir(String str) {
            File fileSafe = MainActivity.this.safe(str);
            if (fileSafe != null) {
                fileSafe.mkdirs();
            }
        }

        @JavascriptInterface
        public void fsRemove(String str) {
            File fileSafe = MainActivity.this.safe(str);
            if (fileSafe != null && !fileSafe.equals(MainActivity.this.root)) {
                MainActivity.deleteRec(fileSafe);
            }
        }

        @JavascriptInterface
        public String fsReadBase64(String str) {
            int i;
            File fileSafe = MainActivity.this.safe(str);
            if (fileSafe == null || !fileSafe.isFile()) {
                return "";
            }
            try {
                byte[] bArr = new byte[(int) Math.min(fileSafe.length(), MainActivity.MAX_READ)];
                FileInputStream fileInputStream = new FileInputStream(fileSafe);
                int i2 = 0;
                while (i2 < bArr.length && (i = fileInputStream.read(bArr, i2, bArr.length - i2)) >= 0) {
                    try {
                        i2 += i;
                    } catch (Throwable th) {
                        fileInputStream.close();
                        throw th;
                    }
                }
                fileInputStream.close();
                return Base64.encodeToString(bArr, 2);
            } catch (Throwable th2) {
                Log.e(MainActivity.TAG, "read " + str, th2);
                return "";
            }
        }

        @JavascriptInterface
        public boolean fsAppendBase64(String str, String str2) {
            File fileSafe = MainActivity.this.safe(str);
            if (fileSafe == null) {
                return false;
            }
            try {
                File parentFile = fileSafe.getParentFile();
                if (parentFile != null) {
                    parentFile.mkdirs();
                }
                byte[] bArrDecode = Base64.decode(str2, 0);
                FileOutputStream fileOutputStream = new FileOutputStream(fileSafe, true);
                try {
                    fileOutputStream.write(bArrDecode);
                    fileOutputStream.close();
                    return true;
                } catch (Throwable th) {
                    fileOutputStream.close();
                    throw th;
                }
            } catch (Throwable th2) {
                Log.e(MainActivity.TAG, "append " + str, th2);
                return false;
            }
        }

        @JavascriptInterface
        public void fsImport(final String str, final int i) {
            MainActivity.this.runOnUiThread(new Runnable() { 
                @Override 
                public void run() {
                    try {
                        JSONObject jSONObject = new JSONObject(str);
                        MainActivity.this.impId = i;
                        MainActivity.this.impTo = jSONObject.optString("to", "");
                        Intent intent = new Intent("android.intent.action.OPEN_DOCUMENT");
                        intent.addCategory("android.intent.category.OPENABLE");
                        intent.setType("audio/*");
                        intent.putExtra("android.intent.extra.ALLOW_MULTIPLE", jSONObject.optBoolean("multiple", false));
                        MainActivity.this.startActivityForResult(intent, MainActivity.REQ_IMPORT);
                    } catch (Throwable th) {
                        MainActivity.this.importDone(i, "[]", "Could not open the file picker: " + th.getMessage());
                    }
                }
            });
        }

        @JavascriptInterface
        public String musicPlay(final String str, final boolean z) {
            File fileSafe;
            if (str.startsWith("files/") && ((fileSafe = MainActivity.this.safe(str.substring(6))) == null || !fileSafe.isFile())) {
                return "file not found: " + str;
            }
            MainActivity.this.ui.post(new Runnable() {
                @Override 
                public void run() {
                    MainActivity.this.startMusic(str, z);
                }
            });
            return "";
        }

        @JavascriptInterface
        public void musicStop() {
            MainActivity.this.ui.post(new Runnable() { 
                @Override 
                public void run() {
                    MainActivity.this.releasePlayer();
                }
            });
        }

        @JavascriptInterface
        public void musicSeek(final double d) {
            MainActivity.this.ui.post(new Runnable() { 
                @Override 
                public void run() {
                    if (MainActivity.this.mp != null) {
                        if (MainActivity.this.prepared) {
                            try {
                                MainActivity.this.mp.seekTo((int) Math.round(d * 1000.0d));
                                return;
                            } catch (Throwable th) {
                                Log.e(MainActivity.TAG, "seek", th);
                                return;
                            }
                        }
                        MainActivity.this.pendingSeek = d;
                    }
                }
            });
        }

        @JavascriptInterface
        public void musicVolume(final double d) {
            MainActivity.this.ui.post(new Runnable() {
                @Override
                public void run() {
                    MainActivity.this.vol = (float) Math.max(0.0d, Math.min(1.0d, d));
                    if (MainActivity.this.mp != null) {
                        try {
                            MainActivity.this.mp.setVolume(MainActivity.this.vol, MainActivity.this.vol);
                        } catch (Throwable th) {
                        }
                    }
                }
            });
        }

        @JavascriptInterface
        public double musicDuration() {
            return MainActivity.this.durCache;
        }
    }

   
    public void releasePlayer() {
        MediaPlayer mediaPlayer = this.mp;
        this.mp = null;
        this.prepared = false;
        this.pendingSeek = -1.0d;
        this.durCache = 0.0d;
        if (mediaPlayer != null) {
            try {
                mediaPlayer.setOnCompletionListener(null);
                mediaPlayer.setOnPreparedListener(null);
                mediaPlayer.setOnErrorListener(null);
                mediaPlayer.reset();
            } catch (Throwable th) {
            }
            try {
                mediaPlayer.release();
            } catch (Throwable th2) {
            }
        }
    }

   
    public void startMusic(String str, boolean z) {
        releasePlayer();
        MediaPlayer mediaPlayer = new MediaPlayer();
        this.mp = mediaPlayer;
        try {
            if (str.startsWith("files/")) {
                FileInputStream fileInputStream = new FileInputStream(safe(str.substring(6)));
                try {
                    mediaPlayer.setDataSource(fileInputStream.getFD());
                } finally {
                    fileInputStream.close();
                }
            } else {
                try {
                    AssetFileDescriptor assetFileDescriptorOpenFd = getAssets().openFd("app/" + str);
                    try {
                        mediaPlayer.setDataSource(assetFileDescriptorOpenFd.getFileDescriptor(), assetFileDescriptorOpenFd.getStartOffset(), assetFileDescriptorOpenFd.getLength());
                    } finally {
                        assetFileDescriptorOpenFd.close();
                    }
                } catch (FileNotFoundException e) {
                    File file = new File(getCacheDir(), "play_" + Math.abs(str.hashCode()) + ".mp3");
                    if (!file.exists()) {
                        InputStream inputStreamOpen = getAssets().open("app/" + str);
                        FileOutputStream fileOutputStream = new FileOutputStream(file);
                        byte[] bArr = new byte[65536];
                        while (true) {
                            int i = inputStreamOpen.read(bArr);
                            if (i <= 0) {
                                break;
                            } else {
                                fileOutputStream.write(bArr, 0, i);
                            }
                        }
                        fileOutputStream.close();
                        inputStreamOpen.close();
                    }
                    mediaPlayer.setDataSource(file.getPath());
                }
            }
            mediaPlayer.setAudioStreamType(3);
            mediaPlayer.setVolume(this.vol, this.vol);
            mediaPlayer.setLooping(z);
            mediaPlayer.setWakeMode(getApplicationContext(), 1);
            mediaPlayer.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
                @Override 
                public void onPrepared(MediaPlayer mediaPlayer2) {
                    if (MainActivity.this.mp == mediaPlayer2) {
                        MainActivity.this.prepared = true;
                        MainActivity.this.durCache = ((double) mediaPlayer2.getDuration()) / 1000.0d;
                        if (MainActivity.this.pendingSeek >= 0.0d) {
                            mediaPlayer2.seekTo((int) Math.round(MainActivity.this.pendingSeek * 1000.0d));
                            MainActivity.this.pendingSeek = -1.0d;
                        }
                        mediaPlayer2.start();
                    }
                }
            });
            mediaPlayer.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
                @Override 
                public void onCompletion(MediaPlayer mediaPlayer2) {
                    if (MainActivity.this.mp == mediaPlayer2) {
                        MainActivity.this.js("window.__spMusicEnd && window.__spMusicEnd()");
                    }
                }
            });
            mediaPlayer.setOnErrorListener(new MediaPlayer.OnErrorListener() { 
                @Override
                public boolean onError(MediaPlayer mediaPlayer2, int i2, int i3) {
                    Log.e(MainActivity.TAG, "MediaPlayer error " + i2 + "/" + i3);
                    if (MainActivity.this.mp == mediaPlayer2) {
                        MainActivity.this.releasePlayer();
                        return true;
                    }
                    return true;
                }
            });
            mediaPlayer.prepareAsync();
        } catch (Throwable th) {
            Log.e(TAG, "play failed: " + str, th);
            if (this.mp == mediaPlayer) {
                releasePlayer();
            }
        }
    }

    @Override
    protected void onActivityResult(int i, int i2, Intent intent) {
        super.onActivityResult(i, i2, intent);
        if (i == REQ_IMPORT) {
            final int i3 = this.impId;
            final String str = this.impTo;
            if (i2 == -1 && intent != null) {
                final ArrayList arrayList = new ArrayList();
                ClipData clipData = intent.getClipData();
                if (clipData != null) {
                    for (int i4 = 0; i4 < clipData.getItemCount(); i4++) {
                        arrayList.add(clipData.getItemAt(i4).getUri());
                    }
                } else if (intent.getData() != null) {
                    arrayList.add(intent.getData());
                }
                new Thread(new Runnable() {
                    @Override 
                    public void run() {
                        String str2;
                        JSONArray jSONArray = new JSONArray();
                        String str3 = null;
                        for (Uri uri : arrayList) {
                            try {
                                String strCopyIn = MainActivity.this.copyIn(uri, str);
                                if (strCopyIn != null) {
                                    jSONArray.put(strCopyIn);
                                }
                                str2 = str3;
                            } catch (Throwable th) {
                                Log.e(MainActivity.TAG, "import " + uri, th);
                                str2 = "Could not import a file: " + th.getMessage();
                            }
                            str3 = str2;
                        }
                        MainActivity mainActivity = MainActivity.this;
                        int i5 = i3;
                        String string = jSONArray.toString();
                        if (jSONArray.length() != 0) {
                            str3 = null;
                        }
                        mainActivity.importDone(i5, string, str3);
                    }
                }).start();
                return;
            }
            importDone(i3, "[]", null);
        }
    }

   
    public String copyIn(Uri uri, String str) throws Throwable {
        Throwable th;
        Cursor cursorQuery;
        String str2;
        String strSubstring;
        Cursor cursor = null;
        string = null;
        String string = null;
        try {
            cursorQuery = getContentResolver().query(uri, new String[]{"_display_name"}, null, null, null);
            if (cursorQuery != null) {
                try {
                    if (cursorQuery.moveToFirst()) {
                        string = cursorQuery.getString(0);
                    }
                } catch (Throwable th2) {
                    th = th2;
                    cursor = cursorQuery;
                    if (cursor == null) {
                        throw th;
                    }
                    cursor.close();
                    throw th;
                }
            }
            if (cursorQuery != null) {
                cursorQuery.close();
                str2 = string;
            } else {
                str2 = string;
            }
        } catch (Throwable th3) {
            th = th3;
        }
        if (str2 == null || str2.length() == 0) {
            str2 = "song_" + System.currentTimeMillis() + ".mp3";
        }
        String strReplace = str2.replace('/', '_').replace('\\', '_');
        if (strReplace.startsWith(".")) {
            strReplace = "_" + strReplace;
        }
        if (str == null) {
            str = "";
        }
        if (str.length() > 0 && !str.endsWith("/")) {
            str = str + "/";
        }
        File fileSafe = safe(str.length() == 0 ? "." : str);
        if (fileSafe == null) {
            throw new IOException("bad destination");
        }
        fileSafe.mkdirs();
        String strSubstring2 = "";
        int iLastIndexOf = strReplace.lastIndexOf(46);
        if (iLastIndexOf > 0) {
            strSubstring = strReplace.substring(0, iLastIndexOf);
            strSubstring2 = strReplace.substring(iLastIndexOf);
        } else {
            strSubstring = strReplace;
        }
        File file = new File(fileSafe, strReplace);
        int i = 1;
        while (file.exists()) {
            i++;
            file = new File(fileSafe, strSubstring + " (" + i + ")" + strSubstring2);
        }
        InputStream inputStreamOpenInputStream = getContentResolver().openInputStream(uri);
        if (inputStreamOpenInputStream == null) {
            throw new IOException("cannot open file");
        }
        FileOutputStream fileOutputStream = new FileOutputStream(file);
        try {
            byte[] bArr = new byte[65536];
            while (true) {
                int i2 = inputStreamOpenInputStream.read(bArr);
                if (i2 <= 0) {
                    fileOutputStream.close();
                    inputStreamOpenInputStream.close();
                    return str + file.getName();
                }
                fileOutputStream.write(bArr, 0, i2);
            }
        } catch (Throwable th4) {
            fileOutputStream.close();
            inputStreamOpenInputStream.close();
            throw th4;
        }
    }


    public void importDone(int i, String str, String str2) {
        js("window.__spImportDone(" + i + "," + JSONObject.quote(str) + "," + (str2 == null ? "null" : JSONObject.quote(str2)) + ")");
    }

   
    public void js(final String str) {
        runOnUiThread(new Runnable() { 
            @Override 
            public void run() {
                if (MainActivity.this.web != null) {
                    MainActivity.this.web.evaluateJavascript(str, null);
                }
            }
        });
    }
}
