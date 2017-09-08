exports.getBrowser  = function (user_agent)
{
  console.log("using helpers!");
  const ua = useragent.parse(user_agent);
  console.log("browser");
  console.log(ua['browser']);
  return ua != null ? ua['browser'] : "";
};

