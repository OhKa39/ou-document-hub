const useRouter = jest.fn(() => {
  push: jest.fn();
});

module.exports = {
  useRouter,
};
