describe('Exercise API', () => {

  it('Add a new exercise', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:5300/exercises/add',
      body: {
        username: 'testuser',
        exerciseType: 'Running',
        description: 'Running 5km',
        duration: 30,
        date: new Date()
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq('Exercise added!');
      id = response.body._id; 
    });
  });

  it('Retrieve all exercises', () => {
    cy.request('http://localhost:5300/exercises').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.length.greaterThan(0);
    });
  });
});
