package com.shopify.rnandroidauto;

import com.facebook.react.bridge.Callback;


public class ReactCarRenderContext {
    private Callback mEventCallback;
    private String screenMarker;

    public Callback getEventCallback() {
        return mEventCallback;
    }

    public ReactCarRenderContext setEventCallback(Callback eventCallback) {
        mEventCallback = eventCallback;
        return this;
    }

    public String getScreenMarker() {
        return screenMarker;
    }

    public ReactCarRenderContext setScreenMarker(String screenMarker) {
        this.screenMarker = screenMarker;
        return this;
    }
}
