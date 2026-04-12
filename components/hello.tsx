type HelloProps = {
  name?: string;
};

export function Hello({ name = 'World' }: HelloProps) {
  return <h1>Hello, {name}</h1>;
}
