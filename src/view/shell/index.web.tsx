import React from 'react'
import {observer} from 'mobx-react-lite'
import {View, StyleSheet, TouchableOpacity} from 'react-native'
import {useStores} from 'state/index'
import {DesktopLeftNav} from './desktop/LeftNav'
import {DesktopRightNav} from './desktop/RightNav'
import {ErrorBoundary} from '../com/util/ErrorBoundary'
import {Lightbox} from '../com/lightbox/Lightbox'
import {ModalsContainer} from '../com/modals/Modal'
import {Composer} from './Composer.web'
import {useColorSchemeStyle} from 'lib/hooks/useColorSchemeStyle'
import {s, colors} from 'lib/styles'
import {RoutesContainer, FlatNavigator} from '../../Navigation'
import {DrawerContent} from './Drawer'
import {useWebMediaQueries} from '../../lib/hooks/useWebMediaQueries'
import {BottomBarWeb} from './bottom-bar/BottomBarWeb'
import {usePalette} from 'lib/hooks/usePalette'

const ShellInner = observer(() => {
  const store = useStores()
  const pal = usePalette('default')
  const {isDesktop} = useWebMediaQueries()

  return (
    <>
      <View style={s.hContentRegion}>
        <ErrorBoundary>
          <FlatNavigator />
        </ErrorBoundary>
      </View>
      {isDesktop && (
        <>
          <DesktopLeftNav />
          <DesktopRightNav />
          <View
            style={[
              styles.viewBorder,
              {borderLeftColor: pal.colors.border},
              styles.viewBorderLeft,
            ]}
          />
          <View
            style={[
              styles.viewBorder,
              {borderLeftColor: pal.colors.border},
              styles.viewBorderRight,
            ]}
          />
        </>
      )}
      <Composer
        active={store.shell.isComposerActive}
        onClose={() => store.shell.closeComposer()}
        winHeight={0}
        replyTo={store.shell.composerOpts?.replyTo}
        quote={store.shell.composerOpts?.quote}
        onPost={store.shell.composerOpts?.onPost}
      />
      {!isDesktop && <BottomBarWeb />}
      <ModalsContainer />
      <Lightbox />
      {!isDesktop && store.shell.isDrawerOpen && (
        <TouchableOpacity
          onPress={() => store.shell.closeDrawer()}
          style={styles.drawerMask}>
          <View style={styles.drawerContainer}>
            <DrawerContent />
          </View>
        </TouchableOpacity>
      )}
    </>
  )
})

export const Shell: React.FC = observer(() => {
  const pageBg = useColorSchemeStyle(styles.bgLight, styles.bgDark)
  return (
    <View style={[s.hContentRegion, pageBg]}>
      <RoutesContainer>
        <ShellInner />
      </RoutesContainer>
    </View>
  )
})

const styles = StyleSheet.create({
  bgLight: {
    backgroundColor: colors.white,
  },
  bgDark: {
    backgroundColor: colors.black, // TODO
  },
  viewBorder: {
    position: 'absolute',
    width: 1,
    height: '100%',
    borderLeftWidth: 1,
  },
  viewBorderLeft: {
    left: 'calc(50vw - 300px)',
  },
  viewBorderRight: {
    left: 'calc(50vw + 300px)',
  },
  drawerMask: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  drawerContainer: {
    display: 'flex',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
  },
})
