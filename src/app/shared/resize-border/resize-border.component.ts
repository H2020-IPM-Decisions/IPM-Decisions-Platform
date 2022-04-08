import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { fromEvent,merge } from 'rxjs';
import { filter, take, startWith,map } from 'rxjs/operators';
export enum TypeDrag {
  Move,
  Top,
  Bottom,
  Left,
  Right,
  TopRight,
  BottomRight,
  TopLeft,
  BottomLeft
}

@Component({
  selector: 'resize-border',
  templateUrl: './resize-border.component.html',
  styleUrls: ['./resize-border.component.css']
})
export class ResizeBorderComponent implements OnInit {
  rect: any;
  incr: number[] = [0, 0, 0, 0];
  nativeElement: any;
  typeDrag: TypeDrag;
  origin: any;
  onDrag: boolean = false;
  moveSubscription: any;
  modalContent: any;

  classNames = [
    'cell-top',
    'cell-border-top',
    'cell-border-bottom',
    'cell-border-left',
    'cell-border-right',
    'cell-top-right',
    'cell-bottom-right',
    'cell-top-left',
    'cell-bottom-left'
  ];

  style: any = null;
  constructor(private elementRef: ElementRef) {}

  @Input() set dragHolder(value) {
    value.classList.add('cell-top');
  }

  ngOnInit(): void {
    this.modalContent = this.findModalContent(this.elementRef.nativeElement);
    merge(
    fromEvent(this.elementRef.nativeElement, 'mousedown'),
    fromEvent(this.elementRef.nativeElement, 'touchstart').pipe(map((event:TouchEvent)=>({
      target:event.target,
      screenX:event.touches[0].screenX,
      screenY:event.touches[0].screenY
    }))
    ))
      .pipe(
        filter((event: MouseEvent) => {
          const classs = (event.target as any).className;
          if (classs && typeof classs === 'string') {
            const className = classs.split(' ');
            return className.indexOf('cell-top') >= 0
              ? true
              : this.classNames.indexOf(classs) >= 0;
          }
          return false;
        })
      )
      .subscribe((event: MouseEvent) => {
        this.rect = this.modalContent.getBoundingClientRect();
        this.origin =  { x: event.screenX, y: event.screenY };

        this.onDrag = true;
        const className = (event.target as any).className.split(' ');
        this.typeDrag =
          className.indexOf('cell-top') >= 0
            ? TypeDrag.Move
            : (this.classNames.indexOf(className[0]) as TypeDrag);

        this.incr =
          this.typeDrag == TypeDrag.Move
            ? [1, 0, 1, 0]
            : this.typeDrag == TypeDrag.Top
            ? [1, -1, 0, 0]
            : this.typeDrag == TypeDrag.Bottom
            ? [0, 1, 0, 0]
            : this.typeDrag == TypeDrag.Right
            ? [0, 0, 0, 1]
            : this.typeDrag == TypeDrag.Left
            ? [0, 0, 1, -1]
            : this.typeDrag == TypeDrag.TopRight
            ? [1, -1, 0, 1]
            : this.typeDrag == TypeDrag.TopLeft
            ? [1, -1, 1, -1]
            : this.typeDrag == TypeDrag.BottomRight
            ? [0, 1, 0, 1]
            : [0, 1, 1, -1];

        this.onDrag = true;

        merge(fromEvent(document, 'mouseup'),
              fromEvent(document,'touchend')
        )
          .pipe(take(1))
          .subscribe(() => {
            if (this.moveSubscription) {
              this.moveSubscription.unsubscribe();
              this.moveSubscription = undefined;
              this.onDrag = false;
            }
          });

        if (!this.moveSubscription) {
          this.moveSubscription = merge(
            fromEvent(document, 'mousemove'),
            fromEvent(document, 'touchmove').pipe(map((event:TouchEvent)=>({
              target:event.target,
              screenX:event.touches[0].screenX,
              screenY:event.touches[0].screenY
            }))
            ))
            .pipe(startWith({ screenY: this.origin.y, screenX: this.origin.x }))
            .subscribe((moveEvent: MouseEvent) => {
              const incrTop = moveEvent.screenY - this.origin.y;
              const incrLeft = moveEvent.screenX - this.origin.x;
              const width = this.rect.width + this.incr[3] * incrLeft;
              const heigth = this.rect.height + this.incr[1] * incrTop;
              this.modalContent.style['max-width'] =
                (width < 50 ? 50 : width) + 'px';
              this.modalContent.style['margin-top'] =
                this.rect.top + this.incr[0] * incrTop + 'px';
              this.modalContent.style['margin-left'] =
                this.rect.left + this.incr[2] * incrLeft + 'px';
              this.style = {
                width: (width < 50 ? 50 : width - 1) + 'px',
                height: (heigth < 75 ? 75 : heigth - 1) + 'px'
              };
            });
        }
      });
  }

  findModalContent(element: HTMLElement) {
    return element.className.includes("modal-dialog")
      ? element
      : element.parentElement
      ? this.findModalContent(element.parentElement)
      : null;
  }
}
