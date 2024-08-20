const DocumentItem = jest.fn((props) => {
  return <div data-testid="DocumentItem" {...props} />;
});

export default DocumentItem;
