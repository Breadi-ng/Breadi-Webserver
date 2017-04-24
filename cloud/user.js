Parse.Cloud.afterSave(Parse.User, (req, res) => {
  let user = req.object;
  var roleACL = new Parse.ACL();

  if (!user.existed()) {
    var cQ = new Parse.Query("Count");
    cQ.equalTo("type", "users");
    return cQ.first().then((count) => {
      if (!count) {
        var Count = Parse.Object.extend("Count");
        var count = new Count();
        count.set("type", "users");
      }
      count.increment("count");
      return count.save();
    }).then(() => {
      var Profile = Parse.Object.extend("Profile");
      var profile = new Profile();

      // ACL
      roleACL.setPublicReadAccess(true);
      roleACL.setReadAccess(user, true);
      roleACL.setWriteAccess(user, true);
      roleACL.setRoleReadAccess("admin", true);
      roleACL.setRoleWriteAccess("admin", true);
      roleACL.setRoleReadAccess("mod", true);
      roleACL.setRoleWriteAccess("mod", true);

      profile.set("user", user);
      profile.setACL(roleACL);
      return profile.save(null, { useMasterKey: true });
    }).then(() => {
      return res.success();
    });
  }
})