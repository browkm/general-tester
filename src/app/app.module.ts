import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {RESPONSIVE_CAROUSEL_DIRECTIVES} from './responsive-carousel/responsive-carousel.component';


@NgModule({
    declarations: [
        AppComponent,
        RESPONSIVE_CAROUSEL_DIRECTIVES
    ],
    imports: [
        BrowserModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
