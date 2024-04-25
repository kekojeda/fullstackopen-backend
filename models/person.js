const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const PersonSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        // Verificar la longitud
        if (v.length < 8) return false;

        // Verificar el formato
        const parts = v.split('-');
        if (parts.length !== 2) return false;

        // Verificar la primera parte (dos o tres números)
        const firstPart = parts[0];
        if (!/^\d{2,3}$/.test(firstPart)) return false;

        // Verificar la segunda parte (solo números)
        const secondPart = parts[1];
        if (!/^\d+$/.test(secondPart)) return false;

        return true;
      },
      message: props => `${props.value} is not valid`
    }
   
  },
})

PersonSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', PersonSchema)