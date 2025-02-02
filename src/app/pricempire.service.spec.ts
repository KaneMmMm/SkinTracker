import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PriceEmpireService } from './pricempire.service';

describe('PriceEmpireService', () => {
  let service: PriceEmpireService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PriceEmpireService],
    });
    service = TestBed.inject(PriceEmpireService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call the API endpoint', () => {
    const dummyResponse = { data: 'test data' };

    service.getData().subscribe((res) => {
      expect(res).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne('/v3/items/prices/test?limit=10');
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });
});