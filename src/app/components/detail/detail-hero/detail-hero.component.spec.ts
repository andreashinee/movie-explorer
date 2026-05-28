import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DetailHeroComponent } from './detail-hero.component';
import { TreeNode } from '@models/tree-node.model';

function createNode(overrides: Partial<TreeNode> = {}): TreeNode {
  return {
    id: 'test-1',
    name: 'Test Title',
    type: 'title',
    icon: 'tv',
    children: [],
    ...overrides,
  };
}

describe('DetailHeroComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailHeroComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(DetailHeroComponent);
    fixture.componentRef.setInput('node', createNode());
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should build hero image URL from hero id', () => {
    const fixture = TestBed.createComponent(DetailHeroComponent);
    const node = createNode({ id: 'img-1' });
    fixture.componentRef.setInput('node', node);

    const url = fixture.componentInstance.heroImg();
    expect(url).toContain('img-1');
    expect(url).toContain('1200');
    expect(url).toContain('500');
  });

  it('should return null for missing meta key', () => {
    const fixture = TestBed.createComponent(DetailHeroComponent);
    fixture.componentRef.setInput('node', createNode());

    expect(fixture.componentInstance.meta('nonexistent')).toBeNull();
  });

  it('should return meta value for existing key', () => {
    const fixture = TestBed.createComponent(DetailHeroComponent);
    const node = createNode({ meta: { year: 2024, match: 95 } });
    fixture.componentRef.setInput('node', node);

    expect(fixture.componentInstance.meta('year')).toBe(2024);
    expect(fixture.componentInstance.meta('match')).toBe(95);
  });

  it('should render the hero banner', () => {
    const fixture = TestBed.createComponent(DetailHeroComponent);
    fixture.componentRef.setInput('node', createNode());
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.hero-banner')).toBeTruthy();
    expect(compiled.querySelector('.hero-title')).toBeTruthy();
  });

  it('should display the node name in the template', () => {
    const fixture = TestBed.createComponent(DetailHeroComponent);
    fixture.componentRef.setInput('node', createNode({ name: 'Awesome Title' }));
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Awesome Title');
  });
});
