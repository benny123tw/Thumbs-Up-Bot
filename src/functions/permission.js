const isValidPermission = (command) => {
    if(command.permissions.length){
        let invalidPerms = []
        for(const perm of command.permissions){
            if(!validPermissions.includes(perm)){
                return console.log(`Invalid Permissions ${perm}`);
            }
            if(!message.member.hasPermission(perm)){
                invalidPerms.push(perm);
            }
        }
        if (invalidPerms.length){
          return invalidPerms;
        }
    }

    return true;
}

module.exports = {

}