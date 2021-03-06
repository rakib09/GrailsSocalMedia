import com.extremecoder.grailssocial.*
import com.extremecoder.grailssocial.enums.RoleType

class BootStrap {

    def init = { servletContext ->

        def adminUser = SecUser.findByUsername('super') ?: new SecUser(
                username: 'super',
                password: 'pass', userType: 'admin', companyName: 'admin').save(failOnError: true)
        def adminRole = SecRole.findByAuthority(RoleType.ADMIN.value) ?: new SecRole(authority: RoleType.ADMIN.value).save(failOnError: true)
        def userRole = SecRole.findByAuthority(RoleType.USER.value) ?: new SecRole(authority: RoleType.USER.value).save(failOnError: true)
        SecUserSecRole secUserSecRole
        if (!adminUser.authorities.contains(adminRole)) {
            secUserSecRole = new SecUserSecRole(secRole: adminRole, secUser: adminUser ).save(failOnError: true)
        }
    }
    def destroy = {
    }
}
