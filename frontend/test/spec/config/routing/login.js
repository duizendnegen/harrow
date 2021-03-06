describe('Routing: login', function () {
  var authentication, $scope, $state, $httpBackend
  beforeEach(angular.mock.inject(function ($rootScope, _$state_, _$httpBackend_, _authentication_) {
    $httpBackend = _$httpBackend_
    authentication = _authentication_
    $scope = $rootScope
    $state = _$state_
    spyOn(authentication, 'hasValidSession').and.callFake(function () {
      return false
    })
    spyOn(authentication, 'hasNoSession').and.callFake(function () {
      return true
    })
  }))

  it('passes though to login by default', function () {
    $state.go('login')
    $scope.$digest()
    expect($state.current.parent).toEqual('layout_tight')
    expect($state.current.name).toEqual('login')
    expect($state.current.url).toEqual('/a/login?invitation&origin')
    expect($state.current.views.main.controller).toEqual('loginCtrl')
    expect($state.current.views.main.controllerAs).toEqual('ctrl')
    expect($state.current.data.requiresAuth).toBeFalsy()
  })

  it('redirects to "dashboard" if session is valid', function () {
    authentication.hasValidSession.and.callFake(function () {
      return true
    })
    $state.go('login')
    $scope.$digest()
    expect($state.current.name).toEqual('dashboard')
  })

  it('redirects to "session_confirmation" if session is valid and there is a invitation param', function () {
    authentication.hasValidSession.and.callFake(function () {
      return false
    })
    authentication.hasNoSession.and.callFake(function () {
      return false
    })
    $state.go('login')
    $scope.$digest()
    expect($state.current.name).toEqual('session_confirmation')
  })

  it('redirects to "invitations/show" if session is valid and there is a invitation param', function () {
    $httpBackend.expect('GET', /\/api\/invitations\/[0-9a-f-]+/).respond(200, {})
    authentication.hasValidSession.and.callFake(function () {
      return true
    })
    $state.go('login', {invitation: 'abc123'})
    $httpBackend.flush()
    expect($state.current.name).toEqual('invitations/show')
  })
})
