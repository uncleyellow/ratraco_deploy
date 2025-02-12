/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
    selector     : 'landing-home',
    templateUrl  : './home.component.html',
    styleUrls: ['./home.component.scss'],
    animations: [
        trigger('fadeIn', [
          transition(':enter', [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ]),
        trigger('slideIn', [
          transition(':enter', [
            style({ transform: 'translateX(-100%)' }),
            animate('800ms ease-out', style({ transform: 'translateX(0)' }))
          ])
        ])
      ],
    encapsulation: ViewEncapsulation.None
})
export class LandingHomeComponent implements OnInit
{
    services = [
        {
          title: 'Vận tải đường sắt container',
          description: 'Dịch vụ vận chuyển container qua đường sắt với độ an toàn và tin cậy cao.',
          icon: 'heroicons:truck',
          image: 'https://ratraco.vn/uploads/052021/home1_14cb2067.png'
        },
        {
          title: 'Vận tải đa phương thức',
          description: 'Kết hợp nhiều phương thức vận tải để tối ưu chi phí và thời gian.',
          icon: 'heroicons:globe-alt',
          image: 'https://ratraco.vn/uploads/052021/home1_14cb2067.png'
        },
        {
          title: 'Logistics',
          description: 'Giải pháp logistics tổng thể cho doanh nghiệp của bạn.',
          icon: 'heroicons:cube',
          image: 'https://ratraco.vn/uploads/052021/home1_14cb2067.png'
        }
      ];
    
      stats = [
        { value: '20+', label: 'Năm Kinh Nghiệm' },
        { value: '1000+', label: 'Khách Hàng' },
        { value: '50+', label: 'Đối Tác' },
        { value: '95%', label: 'Khách Hàng Hài Lòng' }
      ];
    /**
     * Constructor
     */
    constructor()
    {
    }

    ngOnInit(): void {}

    scrollToSection(sectionId: string): void {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
}
