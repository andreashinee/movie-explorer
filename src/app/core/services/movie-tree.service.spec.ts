import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MovieTreeService } from '@services/movie-tree.service';

describe('MovieTreeService', () => {
  let service: MovieTreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(MovieTreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('tree / setTree', () => {
    it('should return the tree', () => {
      const tree = service.tree();
      expect(tree).toBeDefined();
      expect(Array.isArray(tree)).toBeTrue();
    });

    it('should set the tree with setTree', () => {
      const original = service.tree();
      service.setTree([]);
      expect(service.tree()).toEqual([]);
      service.setTree(original);
    });
  });

  describe('buildTree', () => {
    it('should build 6 titles', () => {
      const tree = service.tree();
      expect(tree.length).toBe(6);
    });

    it('should have correct title names', () => {
      const tree = service.tree();
      expect(tree[0].name).toBe('BELLE OF THE BALL');
      expect(tree[1].name).toBe('BREAKING BOUNDARIES');
      expect(tree[2].name).toBe('HOUND INVENTIONS');
      expect(tree[3].name).toBe('THE SALT EMPIRE');
      expect(tree[4].name).toBe('END OF ALGORAB');
      expect(tree[5].name).toBe('PALE FIRE');
    });

    it('should set title type and icon', () => {
      const tree = service.tree();
      tree.forEach((title) => {
        expect(title.type).toBe('title');
        expect(title.icon).toBe('tv');
      });
    });

    it('should have BELLE OF THE BALL with 5 seasons', () => {
      const belle = service.tree()[0];
      expect(belle.children.length).toBe(5);
    });

    it('should have HOUND INVENTIONS with 3 seasons', () => {
      const hound = service.tree()[2];
      expect(hound.children.length).toBe(3);
    });

    it('should have END OF ALGORAB with 2 seasons', () => {
      const end = service.tree()[4];
      expect(end.children.length).toBe(2);
    });

    it('should have titles with no seasons with empty children', () => {
      const breaking = service.tree()[1];
      const salt = service.tree()[3];
      const pale = service.tree()[5];
      expect(breaking.children.length).toBe(0);
      expect(salt.children.length).toBe(0);
      expect(pale.children.length).toBe(0);
    });

    it('should have HOUND INVENTIONS S1 with 4 episodes', () => {
      const houndS1 = service.tree()[2].children[0];
      expect(houndS1.name).toBe('HOUND INVENTIONS S1');
      expect(houndS1.children.length).toBe(4);
    });

    it('should have END OF ALGORAB S1 with 2 episodes', () => {
      const endS1 = service.tree()[4].children[0];
      expect(endS1.name).toBe('END OF ALGORAB S1');
      expect(endS1.children.length).toBe(2);
    });

    it('should set season type and icon', () => {
      const houndSeasons = service.tree()[2].children;
      houndSeasons.forEach((season) => {
        expect(season.type).toBe('season');
        expect(season.icon).toBe('auto_stories');
      });
    });

    it('should set episode type and icon', () => {
      const episodes = service.tree()[2].children[0].children;
      episodes.forEach((ep) => {
        expect(ep.type).toBe('episode');
        expect(ep.icon).toBe('assignment_returned');
      });
    });

  });

  describe('countAll', () => {
    it('should count all nodes in the tree', () => {
      const count = service.countAll();
      expect(count).toBe(22);
    });

    it('should count nodes from a subtree', () => {
      const hound = service.tree()[2];
      const count = service.countAll([hound]);
      expect(count).toBe(8);
    });

    it('should return 0 for an empty tree', () => {
      expect(service.countAll([])).toBe(0);
    });
  });

  describe('findNode', () => {
    it('should find a title by id', () => {
      const node = service.findNode(service.tree(), 'title-1');
      expect(node).toBeDefined();
      expect(node!.name).toBe('BELLE OF THE BALL');
    });

    it('should find a season by id', () => {
      const node = service.findNode(service.tree(), 'season-1');
      expect(node).toBeDefined();
      expect(node!.name).toBe('HOUND INVENTIONS S1');
    });

    it('should find an episode by id', () => {
      const node = service.findNode(service.tree(), 'episode-1');
      expect(node).toBeDefined();
      expect(node!.name).toBe('HOUND INVENTIONS S1 Episode 01');
    });

    it('should return null for non-existent id', () => {
      const node = service.findNode(service.tree(), 'non-existent');
      expect(node).toBeNull();
    });
  });

  describe('filterTree', () => {
    it('should return all nodes when search term is empty', () => {
      const tree = service.tree();
      const filtered = service.filterTree(tree, '');
      expect(filtered.length).toBe(tree.length);
    });

    it('should return all nodes when search term is whitespace', () => {
      const tree = service.tree();
      const filtered = service.filterTree(tree, '   ');
      expect(filtered.length).toBe(tree.length);
    });

    it('should filter by title name', () => {
      const filtered = service.filterTree(service.tree(), 'hound');
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('HOUND INVENTIONS');
    });

    it('should filter by season name and include parent title', () => {
      const filtered = service.filterTree(service.tree(), 'S2');
      expect(filtered.length).toBe(3);
      const names = filtered.map((n) => n.name).sort();
      expect(names).toEqual(['BELLE OF THE BALL', 'END OF ALGORAB', 'HOUND INVENTIONS']);
    });

    it('should filter by episode name and include ancestors', () => {
      const filtered = service.filterTree(service.tree(), 'Episode 01');
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('HOUND INVENTIONS');
      expect(filtered[0].children.length).toBe(1);
      expect(filtered[0].children[0].children.length).toBe(1);
    });

    it('should be case insensitive', () => {
      const lower = service.filterTree(service.tree(), 'belle');
      const upper = service.filterTree(service.tree(), 'BELLE');
      expect(lower.length).toBe(upper.length);
    });
  });

  describe('addChild', () => {
    it('should add a child node to a season parent', () => {
      const parent = service.findNode(service.tree(), 'season-1')!;
      const originalCount = parent.children.length;
      const updated = service.addChild(service.tree(), parent.id, 'New Episode');
      const updatedParent = service.findNode(updated, parent.id)!;
      expect(updatedParent.children.length).toBe(originalCount + 1);
    });

    it('should set type to episode when parent is season', () => {
      const parent = service.findNode(service.tree(), 'season-1')!;
      const updated = service.addChild(service.tree(), parent.id, 'New Episode');
      const updatedParent = service.findNode(updated, parent.id)!;
      const added = updatedParent.children[updatedParent.children.length - 1];
      expect(added.type).toBe('episode');
    });

    it('should set icon to assignment_returned when parent is season', () => {
      const parent = service.findNode(service.tree(), 'season-1')!;
      const updated = service.addChild(service.tree(), parent.id, 'New Episode');
      const updatedParent = service.findNode(updated, parent.id)!;
      const added = updatedParent.children[updatedParent.children.length - 1];
      expect(added.icon).toBe('assignment_returned');
    });

    it('should set type to season when parent is title', () => {
      const parent = service.findNode(service.tree(), 'title-1')!;
      const updated = service.addChild(service.tree(), parent.id, 'New Season');
      const updatedParent = service.findNode(updated, parent.id)!;
      const added = updatedParent.children[updatedParent.children.length - 1];
      expect(added.type).toBe('season');
    });

    it('should set icon to auto_stories when parent is title', () => {
      const parent = service.findNode(service.tree(), 'title-1')!;
      const updated = service.addChild(service.tree(), parent.id, 'New Season');
      const updatedParent = service.findNode(updated, parent.id)!;
      const added = updatedParent.children[updatedParent.children.length - 1];
      expect(added.icon).toBe('auto_stories');
    });

    it('should expand the parent after adding', () => {
      const parent = service.findNode(service.tree(), 'season-1')!;
      const updated = service.addChild(service.tree(), parent.id, 'New Episode');
      const updatedParent = service.findNode(updated, parent.id)!;
      expect(updatedParent).toBeDefined();
    });

    it('should not mutate the original parent', () => {
      const tree = service.tree();
      const parent = service.findNode(tree, 'season-1')!;
      const originalCount = parent.children.length;
      service.addChild(tree, parent.id, 'New Episode');
      expect(parent.children.length).toBe(originalCount);
    });
  });

  describe('renameNode', () => {
    it('should rename a title node', () => {
      const updated = service.renameNode(service.tree(), 'title-1', 'NEW NAME');
      const node = service.findNode(updated, 'title-1');
      expect(node!.name).toBe('NEW NAME');
    });

    it('should rename a season node', () => {
      const updated = service.renameNode(service.tree(), 'season-1', 'Renamed Season');
      const node = service.findNode(updated, 'season-1');
      expect(node!.name).toBe('Renamed Season');
    });

    it('should rename an episode node', () => {
      const updated = service.renameNode(service.tree(), 'episode-1', 'Renamed Episode');
      const node = service.findNode(updated, 'episode-1');
      expect(node!.name).toBe('Renamed Episode');
    });

    it('should return same tree when renaming a non-existent id', () => {
      const original = service.tree();
      const updated = service.renameNode(original, 'non-existent', 'whatever');
      expect(updated.length).toBe(original.length);
    });
  });

  describe('deleteNode', () => {
    it('should delete a title node', () => {
      const result = service.deleteNode(service.tree(), 'title-1');
      expect(result.length).toBe(5);
      expect(result.find((n) => n.id === 'title-1')).toBeUndefined();
    });

    it('should delete a season node', () => {
      const hound = service.tree()[2];
      const seasonId = hound.children[0].id;
      const updatedTitle = service.deleteNode([hound], seasonId);
      expect(updatedTitle[0].children.length).toBe(2);
    });

    it('should delete an episode node', () => {
      const houndS1 = service.tree()[2].children[0];
      const epId = houndS1.children[0].id;
      const updatedSeason = service.deleteNode([houndS1], epId);
      expect(updatedSeason[0].children.length).toBe(3);
    });

    it('should return same array when deleting non-existent id', () => {
      const tree = service.tree();
      const result = service.deleteNode(tree, 'non-existent');
      expect(result.length).toBe(tree.length);
    });
  });

  describe('findParentTitle', () => {
    it('should find parent of a season', () => {
      const parent = service.findParentTitle('season-1');
      expect(parent).toBeDefined();
      expect(parent!.name).toBe('HOUND INVENTIONS');
    });

    it('should find parent of an episode', () => {
      const parent = service.findParentTitle('episode-1');
      expect(parent).toBeDefined();
      expect(parent!.name).toBe('HOUND INVENTIONS');
    });

    it('should return null for a title id', () => {
      const parent = service.findParentTitle('title-1');
      expect(parent).toBeNull();
    });

    it('should return null for a non-existent id', () => {
      const parent = service.findParentTitle('non-existent');
      expect(parent).toBeNull();
    });
  });

  describe('getEpisodeList', () => {
    it('should return children for a season node', () => {
      const season = service.findNode(service.tree(), 'season-1')!;
      const episodes = service.getEpisodeList(season);
      expect(episodes.length).toBe(4);
    });

    it('should return empty array for a title node', () => {
      const title = service.tree()[0];
      const episodes = service.getEpisodeList(title);
      expect(episodes).toEqual([]);
    });

    it('should return empty array for an episode node', () => {
      const ep = service.findNode(service.tree(), 'episode-1')!;
      const episodes = service.getEpisodeList(ep);
      expect(episodes).toEqual([]);
    });
  });
});
