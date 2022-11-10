let usersInDocId = {};

const getUsers = (docId) => {
    let users = [];
    Object.keys(usersInDocId).forEach((u) => {
        if(usersInDocId[u].docId === docId) users.push({userName: usersInDocId[u].user, socketId: u});
    })
    return users;
}

const setUserAndDocId = (user, docId, socketId) => {
    if(!socketId || !user || !docId) return;
    usersInDocId[socketId] = { docId, user };
    return getUsers(docId);
}

const deleteUser = (socketId) => {
    if(!socketId || !usersInDocId[socketId] || !usersInDocId[socketId].docId) return;
    const docId = usersInDocId[socketId].docId;
    const {[socketId]: remove, ...rest} = usersInDocId;
    usersInDocId = rest;
    const updatedUsers = getUsers(docId);
    return { docId,updatedUsers };
}


module.exports = {
    setUserAndDocId,
    deleteUser,
}