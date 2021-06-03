package com.shopify.rnandroidauto;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactContext;
import com.google.android.libraries.car.app.CarContext;
import com.google.android.libraries.car.app.Screen;
import com.google.android.libraries.car.app.model.Pane;
import com.google.android.libraries.car.app.model.PaneTemplate;
import com.google.android.libraries.car.app.model.Template;

public class CarScreen extends Screen {
    private Template mTemplate;

    public CarScreen(CarContext carContext, ReactContext reactContext) {
        super(carContext);
    }

    public void setTemplate(Template template) {
        mTemplate = template;
    }

    @NonNull
    @Override
    public Template getTemplate() {
        if (mTemplate != null) {
            return mTemplate;
        }

        return PaneTemplate.builder(
                Pane.builder().setIsLoading(true).build()
        ).setTitle("Shopify Local Delivery").build();
    }
}
