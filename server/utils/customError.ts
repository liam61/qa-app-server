function customError(name: string, message: string) {
  const err = new Error(message);
  err.name = name;

  return err;
}
