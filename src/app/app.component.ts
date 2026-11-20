import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <header class="topbar">
      <a class="brand" routerLink="/" aria-label="Pratra Flight Search home">
        <span class="brand-icon">&#9992;</span><span>Pratra Flight Search</span>
      </a>
    </header>
    <main class="page-shell"><router-outlet /></main>
    <footer class="footer">Flight Search <span>·</span> Find your next journey</footer>
  `,
  styles: [`
    .topbar{height:64px;background:linear-gradient(105deg,#102e64,#174b9c);display:flex;align-items:center;padding:0 max(calc((100% - 1240px)/2),24px);box-shadow:0 3px 12px #0d2c5a22}
    .brand{display:flex;align-items:center;gap:10px;color:#fff;text-decoration:none;font-size:19px;font-weight:750;letter-spacing:-.3px}
    .brand-icon{font-size:23px;transform:rotate(-8deg)}
    .page-shell{max-width:1240px;margin:34px auto 60px;padding:0 24px;min-height:calc(100vh - 150px)}
    .footer{text-align:center;color:#8490a2;font-size:12px;padding:22px}.footer span{padding:0 7px}
    @media(max-width:700px){.topbar{height:58px;padding:0 18px}.page-shell{margin:20px auto 40px;padding:0 14px}}
  `]
})
export class AppComponent {}
