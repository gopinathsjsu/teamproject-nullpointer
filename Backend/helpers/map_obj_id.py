def map_obj_id(obj):
  el = { "id" : obj["_id"]["$oid"] }
  for x in obj.keys():
    if(x!="_id"):
      el[x] = obj[x]
  return el