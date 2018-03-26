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
            if (childIndex === 0) {
                this.addActive(ele.children[childIndex]);
            } else {
                this.addNext(ele.children[childIndex], childIndex);
            }
            childrenWidth += ele.children[childIndex].clientWidth;
            childIndex++;
            this.visibleSlideCount++;
        }
        this.canScroll = childIndex < ele.children.length;

        // remove active class from other children
        for (; childIndex < ele.children.length; childIndex++) {
            this.clearSyling(ele.children[childIndex]);
        }
    }

    private addActive(el: any) {
        this.renderer.addClass(el, 'active');
    }

    private removeActive(el: any) {
        this.renderer.removeClass(el, 'active');
    }

    private block(el: any) {
        this.renderer.setStyle(el, 'display', 'block');
        this.renderer.setStyle(el, 'position', 'absolute');
        this.renderer.setStyle(el, 'top', 0);
    }

    private unBlock(el: any) {
        this.renderer.removeStyle(el, 'display');
        this.renderer.removeStyle(el, 'position');
        this.renderer.removeStyle(el, 'top');
    }

    private addNext(el: any, index: number = 0) {
        this.block(el);
        this.renderer.setStyle(el, 'left', (index * el.clientWidth).toString() + 'px');
    }

    private addPrev(el: any, index: number = 0) {
        this.block(el);
        this.renderer.setStyle(el, 'left', (-1 * index * el.clientWidth).toString() + 'px');
    }

    private clearSyling(el: any) {
        this.renderer.removeAttribute(el, 'style');
    }

    private transitionSlide(el: any, indexOffset: number) {
        this.renderer.setStyle(el, 'transform', 'translateX(' + (indexOffset * 100) + '%)');
    }

    private slide(direction: string) {
        const ele = this.scrollerEl.nativeElement;
        const activeElement = ele.querySelector('.active.carousel-item');
        const activeElementIndex = this.getItemIndex(activeElement);

        const nextElement = this.getItemByDirection(direction, activeElementIndex);

        this.isSliding = true;

        if (direction === 'prev') {
            this.addPrev(nextElement, 1);
            const reflow = nextElement.offsetWidth;

            for (let i = activeElementIndex + this.visibleSlideCount - 1; i >= activeElementIndex; i--) {
                this.transitionSlide(ele.children[i], 1);
            }
            this.transitionSlide(nextElement, 1);
        } else {
            this.addNext(nextElement, this.visibleSlideCount);
            const reflow = nextElement.offsetWidth;

            let count = 1;
            for (let i = activeElementIndex; count <= this.visibleSlideCount; i = (i + 1) % ele.children.length) {
                this.transitionSlide(ele.children[i], -1);
                count++;
            }
            this.transitionSlide(nextElement, -1);
        }

        setTimeout(() => {
            if (direction === 'prev') {
                this.unBlock(nextElement);
                this.clearSyling(nextElement);
                this.addActive(nextElement);

                let firstTime = true;
                for (let i = ele.children.length - 1; i >= 0; i--) {
                    this.removeActive(ele.children[i]);
                    this.unBlock(ele.children[i]);
                    this.clearSyling(ele.children[i]);
                    if (!firstTime) {
                        this.addNext(ele.children[i], i + 1);
                    }
                    firstTime = false;
                }
            } else {
                const nextActiveElementIndex = (activeElementIndex + 1) % ele.children.length;
                this.unBlock(ele.children[nextActiveElementIndex]);
                this.clearSyling(ele.children[nextActiveElementIndex]);
                this.addActive(ele.children[nextActiveElementIndex]);

                this.removeActive(ele.children[activeElementIndex]);
                this.clearSyling(ele.children[activeElementIndex]);

                let count = 1;
                for (let i = (activeElementIndex + 2) % ele.children.length;
                     count < this.visibleSlideCount;
                     i = (i + 1) % ele.children.length) {
                    this.unBlock(ele.children[i]);
                    this.clearSyling(ele.children[i]);
                    this.addNext(ele.children[i], count);
                    count++;
                }
                // this.unBlock(nextElement);
                // this.clearSyling(nextElement);
                // this.addNext(nextElement, this.visibleSlideCount - 1);
            }
            this.isSliding = false;
        }, 600);
    }

    private getItemByDirection(direction: string, activeElementIndex: number) {
        const ele = this.scrollerEl.nativeElement;
        const numItems = ele.children.length;
        const isNextDirection = direction === 'next';
        const isPrevDirection = direction === 'prev';
        const lastItemIndex = numItems - 1;

        // const isGoingToWrap = (isPrevDirection && activeIndex === 0) || (isNextDirection && activeIndex === lastItemIndex);
        // if (isGoingToWrap && !this._config.wrap) {
        //     return activeElement
        // }

        const delta = direction === 'prev' ? -1 : this.visibleSlideCount;
        const itemIndex = (activeElementIndex + delta) % numItems;

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
