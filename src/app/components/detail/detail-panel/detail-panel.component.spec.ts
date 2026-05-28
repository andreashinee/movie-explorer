import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DetailPanelComponent } from './detail-panel.component';
import { EditorStateService } from '@services/editor-state.service';
import { MovieTreeService } from '@services/movie-tree.service';

describe('DetailPanelComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailPanelComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(DetailPanelComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show empty state when no node is selected', () => {
    const fixture = TestBed.createComponent(DetailPanelComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-state')).toBeTruthy();
  });

  it('should show detail view when a node is selected', () => {
    const fixture = TestBed.createComponent(DetailPanelComponent);
    const component = fixture.componentInstance;
    const editorState = fixture.debugElement.injector.get(EditorStateService);
    const title = TestBed.inject(MovieTreeService).tree()[0];
    editorState.select(title);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.detail-scroll')).toBeTruthy();
    expect(compiled.textContent).toContain(title.name);
  });

  it('should show add modal when onAdd is called for a title', () => {
    const fixture = TestBed.createComponent(DetailPanelComponent);
    const component = fixture.componentInstance;
    const editorState = fixture.debugElement.injector.get(EditorStateService);
    const title = TestBed.inject(MovieTreeService).tree()[0];
    editorState.select(title);

    component.onAdd();
    expect(component.showModal()).toBeTrue();
    expect(component.modalNodeType()).toBe('season');
  });

  it('should show add modal when onAdd is called for a season', () => {
    const fixture = TestBed.createComponent(DetailPanelComponent);
    const component = fixture.componentInstance;
    const editorState = fixture.debugElement.injector.get(EditorStateService);
    const season = TestBed.inject(MovieTreeService).tree()[2].children[0];
    editorState.select(season);

    component.onAdd();
    expect(component.showModal()).toBeTrue();
    expect(component.modalNodeType()).toBe('episode');
  });

  it('should not show add modal when onAdd is called for an episode', () => {
    const fixture = TestBed.createComponent(DetailPanelComponent);
    const component = fixture.componentInstance;
    const editorState = fixture.debugElement.injector.get(EditorStateService);
    const episode = TestBed.inject(MovieTreeService).tree()[2].children[0]?.children[0];
    editorState.select(episode);

    if (episode) {
      component.onAdd();
      expect(component.showModal()).toBeFalse();
    }
  });

  it('should call addChild and close modal on addConfirmed', () => {
    const fixture = TestBed.createComponent(DetailPanelComponent);
    const component = fixture.componentInstance;
    const editorState = fixture.debugElement.injector.get(EditorStateService);
    const title = TestBed.inject(MovieTreeService).tree()[0];
    const originalCount = title.children.length;
    editorState.select(title);
    component.showModal.set(true);
    spyOn(TestBed.inject(MovieTreeService), 'addChild').and.callThrough();

    component.onAddConfirmed({ name: 'New Season', description: '', icon: 'auto_stories' });

    expect(TestBed.inject(MovieTreeService).addChild).toHaveBeenCalled();
    expect(component.showModal()).toBeFalse();
    const updatedTitle = TestBed.inject(MovieTreeService).findNode(TestBed.inject(MovieTreeService).tree(), title.id)!;
    expect(updatedTitle.children.length).toBe(originalCount + 1);
  });

  it('should show confirm dialog on delete', () => {
    const fixture = TestBed.createComponent(DetailPanelComponent);
    const component = fixture.componentInstance;
    const editorState = fixture.debugElement.injector.get(EditorStateService);
    const title = TestBed.inject(MovieTreeService).tree()[0];
    editorState.select(title);

    component.onDelete();
    expect(component.showConfirm()).toBeTrue();
  });

  it('should show confirm dialog on deleteChild', () => {
    const fixture = TestBed.createComponent(DetailPanelComponent);
    const component = fixture.componentInstance;
    const editorState = fixture.debugElement.injector.get(EditorStateService);
    const title = TestBed.inject(MovieTreeService).tree()[0];
    editorState.select(title);
    const child = title.children[0];

    if (child) {
      component.onDeleteChild(child);
      expect(component.showConfirm()).toBeTrue();
    }
  });

  it('should return episode number with padding', () => {
    const fixture = TestBed.createComponent(DetailPanelComponent);
    const component = fixture.componentInstance;
    const episode = TestBed.inject(MovieTreeService).tree()[2].children[0]?.children[0];
    if (episode) {
      expect(component.formatEpisodeNumber(episode)).toBe('01');
    }
  });

  it('should return em dash for missing episode number', () => {
    const fixture = TestBed.createComponent(DetailPanelComponent);
    const component = fixture.componentInstance;
    const title = TestBed.inject(MovieTreeService).tree()[0];
    expect(component.formatEpisodeNumber(title)).toBe('\u2014');
  });

  it('should select a node', () => {
    const fixture = TestBed.createComponent(DetailPanelComponent);
    const component = fixture.componentInstance;
    const editorState = fixture.debugElement.injector.get(EditorStateService);
    const title = TestBed.inject(MovieTreeService).tree()[0];

    component.selectNode(title);
    expect(editorState.selectedNode()).toBe(title);
  });
});
