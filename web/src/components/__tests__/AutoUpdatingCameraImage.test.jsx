import { h } from 'preact';
import AutoUpdatingCameraImage from '../AutoUpdatingCameraImage';
import { screen, render } from '@testing-library/preact';

let mockOnload;
jest.mock('../CameraImage', () => {
  function CameraImage({ onload, searchParams }) {
    mockOnload = () => {
      onload();
    };
    return <div data-testid="camera-image">{searchParams}</div>;
  }
  return {
    __esModule: true,
    default: CameraImage,
  };
});

describe('AutoUpdatingCameraImage', () => {
  let dateNowSpy;
  beforeEach(() => {
    dateNowSpy = jest.spyOn(Date, 'now').mockReturnValue(0);
  });

  test('shows FPS by default', async () => {
    render(<AutoUpdatingCameraImage camera="tacos" />);
    expect(screen.queryByText('Displaying at 0fps')).toBeInTheDocument();
  });

  test('does not show FPS if turned off', async () => {
    render(<AutoUpdatingCameraImage camera="tacos" showFps={false} />);
    expect(screen.queryByText('Displaying at 0fps')).not.toBeInTheDocument();
  });

  test('on load, sets a new cache key to search params', async () => {
    dateNowSpy.mockReturnValueOnce(100).mockReturnValueOnce(200).mockReturnValueOnce(300);
    render(<AutoUpdatingCameraImage camera="tacos" searchParams="foo" />);
    mockOnload();
    jest.runAllTimers();
    expect(screen.queryByText('cache=100&foo')).toBeInTheDocument();
  });
});