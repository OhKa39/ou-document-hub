const Carousel = jest.fn(({ children }) => {
  return <div data-testid="carousel">{children}</div>;
});

export default Carousel;
