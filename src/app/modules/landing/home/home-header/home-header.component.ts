/* eslint-disable @angular-eslint/component-selector */
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'app-header',
    templateUrl  : './home-header.component.html',
    styleUrls: ['./home-header.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HeaderComponent 
{
    /**
     * Constructor
     */
    constructor()
    {
    }

    isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
