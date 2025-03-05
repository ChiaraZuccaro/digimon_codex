import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SceneIds } from '@configs/scene-factory';
import { descrHome, keywordsHome } from '@meta/meta-home';
import { ThreeService } from '@services/three.service';

@Component({
  selector: 'home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private id: SceneIds = 'home';
  
  constructor(
    private _threeService: ThreeService,
    private _titleService: Title,
    private _metaService: Meta
  ) { this.setHomeMetatag(); }

  ngAfterViewInit() {
    const heroNode = document.getElementById('hero');
    if(heroNode) {
      this._threeService.initSceneById(heroNode, this.id).then(
        () => { this._threeService.uploadModels(this.id); this._threeService.animate(this.id); }
      );
    }
  }

  ngOnDestroy() {
    this._threeService.destroyScene(this.id);
  }

  private setHomeMetatag() {
    this._titleService.setTitle('Digimon Codex');
    this._metaService.addTags([
      { name: 'description', content: descrHome },
      { name: 'keywords', content: keywordsHome },
      { name: 'robots', content: 'index, follow' }
    ]);
  }
}
