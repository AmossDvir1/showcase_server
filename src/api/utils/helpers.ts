const allDetailsProvided = (data: any) => {
    const requiredProperties = [
      "username",
      "email",
      "password",
      "firstName",
      "lastName",
    ];
    return requiredProperties.every((property) => data?.hasOwnProperty(property));
  };

  const isNullOrUndefined = (val: any) => {
    return (val === null || val === undefined);
  }

  export { allDetailsProvided, isNullOrUndefined }