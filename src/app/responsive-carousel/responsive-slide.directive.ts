import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: 'ng-template[appResponsiveSlide]'
})
export class ResponsiveSlideDirective {
    constructor(public templateRef: TemplateRef<any>) {
    }
}
