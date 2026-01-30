type props = {
  error?: string;
  code?: number;
  message?: string;
};

export const ErrorPage = ({ error, code, message }: props) => {
  return (
    <>
      <p> {error} </p>{" "}
    </>
  );
};
