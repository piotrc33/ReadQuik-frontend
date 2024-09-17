import { TestBed } from '@angular/core/testing';
import { ResultsApiService } from 'src/app/api/services/results-api.service';
import { ResultsFacade } from './results.facade';
import { BASE_URL } from 'src/app/api/services/env.service';
import { of } from 'rxjs';
import { RecentResultsState } from 'src/app/features/exercises/services/recent-results/recent-results.state';

const mockResultsApiService = {
  getRecentResults: jest.fn(),
  getAllResults: jest.fn(),
};

const mockRecentResultsState = {
  updateRecentResults: jest.fn(),
};

const mockEnvService = {
  getBaseUrl: jest.fn(),
};

describe('ResultsFacade', () => {
  let service: ResultsFacade;
  let resultsApiService: jest.Mocked<ResultsApiService>;
  let recentResultsState: jest.Mocked<RecentResultsState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: BASE_URL,
          useValue: mockEnvService,
        },
        {
          provide: ResultsApiService,
          useValue: mockResultsApiService,
        },
        {
          provide: RecentResultsState,
          useValue: mockRecentResultsState,
        },
      ],
    });
    service = TestBed.inject(ResultsFacade);
    resultsApiService = TestBed.inject(ResultsApiService) as jest.Mocked<ResultsApiService>;
    recentResultsState = TestBed.inject(RecentResultsState) as jest.Mocked<RecentResultsState>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRecentResults', () => {
    it('should call getRecentResults from ResultsApiService and update state', async () => {
      const mockResult = [
        { _id: '1', wpm: 250, date: new Date().toString(), percentDiff: 10 },
      ];
      resultsApiService.getRecentResults.mockReturnValue(of(mockResult));

      await service.getRecentResults();

      expect(resultsApiService.getRecentResults).toHaveBeenCalled();
      expect(recentResultsState.updateRecentResults).toHaveBeenCalledWith(mockResult);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
