package expo.modules.kotlin.views

import android.os.Looper
import android.view.View
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.exception.NullArgumentException
import expo.modules.kotlin.jni.CppType
import expo.modules.kotlin.jni.ExpectedType
import expo.modules.kotlin.types.TypeConverter
import kotlin.reflect.KClass
import kotlin.reflect.KType

class ViewTypeConverter<T : View>(
  val type: KType
) : TypeConverter<T>() {

  override fun convert(value: Any?, context: AppContext?): T? {
    if (Thread.currentThread() !== Looper.getMainLooper().thread) {
      throw Exceptions.IncorrectThreadException(
        Thread.currentThread().name,
        Looper.getMainLooper().thread.name
      )
    }
    if (value == null) {
      if (type.isMarkedNullable) {
        return null
      }
      throw NullArgumentException()
    }

    val appContext = context ?: throw Exceptions.AppContextLost()
    val viewTag = value as Int
    val view = appContext.findView<T>(viewTag)
    if (!type.isMarkedNullable && view == null) {
      throw Exceptions.ViewNotFound(type.classifier as KClass<*>, viewTag)
    }

    return view
  }

  override fun getCppRequiredTypes(): ExpectedType = ExpectedType(
    CppType.INT,
    CppType.VIEW_TAG
  )

  override fun isTrivial(): Boolean = false
}
