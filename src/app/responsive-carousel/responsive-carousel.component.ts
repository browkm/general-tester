import {
    AfterContentChecked, Component, ContentChildren, DoCheck, ElementRef, HostListener, OnInit, QueryList, Renderer2,
    ViewChild
} from '@angular/core';
import {ResponsiveSlideDirective} from './responsive-slide.directive';

@Component({
    selector: 'app-responsive-carousel',
    templateUrl: './responsive-carousel.component.html',
    styleUrls: ['./responsive-carousel.component.scss']
})
export class ResponsiveCarouselComponent implements OnInit, AfterContentChecked, DoCheck {
    @ContentChildren(ResponsiveSlideDirective) slides: QueryList<ResponsiveSlideDirective>;
    @ViewChild('scroller') scrollerEl: ElementRef;

    scrollerViewWidth: number;
    canScroll = false;

    prevChildrenLength = 0;
    currIndex = 0;
    visibleSlideCount = 0;

    private isSliding = false;

    private resetScroller() {
        this.currIndex = 0;
        const ele = this.scrollerEl.nativeElement;
        this.scrollerViewWidth = ele.clientWidth;

        let childrenWidth = 0;
        let childIndex = 0;
        while (childrenWidth < this.scrollerViewWidth
            && childIndex < ele.children.length) {
            if (childIndex > 0) {
                this.positionSlide(ele.children[childIndex], childIndex);
            }
            childrenWidth += ele.children[childIndex].clientWidth;
            childIndex++;
            this.visibleSlideCount++;
        }
        this.canScroll = childIndex < ele.children.length;

        // remove active class from other children
        for (; childIndex < ele.children.length; childIndex++) {
            this.positionSlide(ele.children[childIndex], childIndex);
        }
    }

    private activateSlide(el: any, indexOffset: number = 0) {
        if (indexOffset > 0) {
            this.positionSlide(el, indexOffset);
        }
        // this.renderer.addClass(el, 'active');
    }

    private hideSlide(el: any) {
        // this.renderer.removeClass(el, 'active');
    }

    private removeStyle(el: any) {
        this.renderer.removeAttribute(el, 'style');
    }

    private positionSlide(el: any, indexOffset: number) {
        this.renderer.setStyle(el, 'position', 'absolute');
        this.renderer.setStyle(el, 'top', '0');
        this.renderer.setStyle(el, 'left', indexOffset * el.clientWidth + 'px');
    }

    // private transitionSlide(el: any, indexOffset: number) {
    //     this.renderer.setStyle(el, 'transform', 'translateX(' + (indexOffset * 100) + '%)');
    // }

    private slide(direction: string) {
        const ele = this.scrollerEl.nativeElement;
        const activeElements = ele.querySelectorAll('.active.carousel-item');
        const activeElementIndexes = [];

        for (let i = 0; i < activeElements.length; i++) {
            activeElementIndexes[i] = this.getItemIndex(activeElements[i]);
        }

        const nextElement = this.getItemByDirection(direction, activeElementIndexes);

        this.isSliding = true;

        this.activateSlide(nextElement, (direction === 'prev') ? -1 : activeElements.length);
        if (direction === 'prev') {
            for (let i = activeElements.length - 1; i >= 0; i--) {
                this.positionSlide(activeElements[i], i + 1);
            }
            this.positionSlide(nextElement, 0);
        } else {
            for (let i = 0; i < activeElements.length; i++) {
                this.positionSlide(activeElements[i], i - 1);
            }
            this.positionSlide(nextElement, activeElements.length - 1);
        }

        setTimeout(() => {
            if (direction === 'prev') {
                this.removeStyle(nextElement);
                this.hideSlide(activeElements[activeElements.length - 1]);
            } else {
                this.removeStyle(activeElements[1]);
                this.hideSlide(activeElements[0]);
            }
            this.isSliding = false;
        }, 600);
    }

    private getItemByDirection(direction: string, activeElementIndexes: Array<number>) {
        const ele = this.scrollerEl.nativeElement;
        const numItems = ele.children.length;
        const isNextDirection = direction === 'next';
        const isPrevDirection = direction === 'prev';
        const activeIndex = isPrevDirection ? activeElementIndexes[0] : activeElementIndexes[activeElementIndexes.length - 1];
        const lastItemIndex = numItems - 1;

        // const isGoingToWrap = (isPrevDirection && activeIndex === 0) || (isNextDirection && activeIndex === lastItemIndex);
        // if (isGoingToWrap && !this._config.wrap) {
        //     return activeElement
        // }

        const delta = direction === 'prev' ? -1 : 1;
        const itemIndex = (activeIndex + delta) % numItems;

        return itemIndex === -1 ? ele.children[numItems - 1] : ele.children[itemIndex];
    }

    private getItemIndex(element: any) {
        const ele = this.scrollerEl.nativeElement;
        return Array.from(ele.querySelectorAll('.carousel-item')).indexOf(element);
    }

    constructor(private renderer: Renderer2) {
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.resetScroller();
    }

    ngOnInit() {
    }

    ngAfterContentChecked(): void {
    }

    ngDoCheck(): void {
        const ele = this.scrollerEl.nativeElement;
        // avoid extra checks
        if (ele.children.length > 0 && ele.children.length !== this.prevChildrenLength) {
            this.prevChildrenLength = ele.children.length;
            this.resetScroller();
        }
    }

    prev() {
        if (this.canScroll && !this.isSliding) {
            this.slide('prev');
        //     const ele = this.scrollerEl.nativeElement;
        //     if (ele.scrollLeft === 0) {
        //         // prepend to the child element array from the end
        //         const newFirstChild = ele.children[ele.children.length - 1];
        //         ele.insertBefore(newFirstChild, ele.children[0]);
        //         ele.scrollLeft += newFirstChild.clientWidth;
        //         this.currIndex++;
        //     }
        //     this.currIndex--;
        //     clearTimeout(this.scrollToTimer);
        }
    }

    next() {
        if (this.canScroll && !this.isSliding) {
            this.slide('next');
        //     const ele = this.scrollerEl.nativeElement;
        //     if (this.scrollerTotalWidth - ele.scrollLeft === this.scrollerViewWidth) {
        //         // append to the child element array from the beginning
        //         const newFirstChild = this.childrenArr[0];
        //         ele.appendChild(newFirstChild);
        //         ele.scrollLeft -= newFirstChild.clientWidth;
        //         this.currIndex--;
        //     }
        //     if (this.currIndex + 1 <= this.childrenArr.length - 1) {
        //         this.currIndex++;
        //         clearTimeout(this.scrollToTimer);
        //         // this.scrollTo(ele, this.toChildrenLocation(), 500);
        //     }
        }
    }

}

export const RESPONSIVE_CAROUSEL_DIRECTIVES = [ResponsiveCarouselComponent, ResponsiveSlideDirective];
